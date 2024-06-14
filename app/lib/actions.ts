"use server";
import {z} from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERR_MSG } from "@/app/lib/constants";
import validator from "validator";
import { SmsTokenProps } from "@/app/lib/defenitions";
import { redirect, } from "next/navigation";
import bcrypt from "bcrypt"
import db from "@/app/lib/db";
import getSession from "@/app/lib/session";
import { revalidatePath } from "next/cache";
import { getUser } from "@/app/lib/data";


export async function signUp(prevState: any, formData : FormData){
  const checkUniqueEmail = async ( email:string ) => {
    const user = await db.user.findUnique({
      select : { id:true },
      where : { email }
    });    
    return !Boolean(user)
  }

  const checkUniqueUsername = async ( user_name:string ) => {
    const user = await db.user.findUnique({
      select : { id:true },
      where : { user_name }
    });    
    return !Boolean(user)
  }  

  const checkPasswordMatch = ({
    password,
    confirm_password
  } : {
    password : string;
    confirm_password : string;
  }) => password === confirm_password
    

  const formSchema = z.object({
    email: z.string()
    .email()
    .toLowerCase()
    .refine(checkUniqueEmail, "이미 사용 중인 메일 주소입니다."),

    username : z.string({
      invalid_type_error:"사용자명은 문자로 입력되어야 합니다.", 
      required_error:"사용자명은 필수입니다."})
      .min(1)
      .trim()
      .refine(checkUniqueUsername, "이미 사용 중인 사용자명 입니다."),
    
    password: z.string()
    .min(PASSWORD_MIN_LENGTH,"암호는 8자 이상이어야 합니다.")
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERR_MSG),

    confirm_password: z.string()
    .min(PASSWORD_MIN_LENGTH,"암호는 8자 이상이어야 합니다."),
  }).refine(checkPasswordMatch, {
    message : "암호가 동일하지 않습니다",
    path : ["confirm_password"],
  })
  
  const data = {
    email : formData.get("email"),
    username : formData.get("username"),
    password : formData.get("password"),
    confirm_password : formData.get("confirm_password"),
  }
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 8);
    const user = await db.user.create({
      data: {
        email : result.data.email,
        user_name : result.data.username,
        password : hashedPassword,
      }
    });
    
    await createDefaultCategory(user.id);
    const user_category_group_id = await createDefaultCategoryGroup(user.id);
    await createDefaultLedger(user.id, user_category_group_id);
    
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/user");
  }
}  

export async function signIn(prevState: any, formData : FormData){
  const formSchema = z.object({
    email : z.string().email().toLowerCase(),
    password : z
    .string({required_error : "암호는 필수 항목 입니다"})
  }).superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      select: {
        id: true,
      },      
      where: {
        email,
      },
    });
    if (!user){
      ctx.addIssue({
        code: "custom",
        message: "이메일 혹은 패스워드가 올바르지 않습니다.",
        path: ["password"],
        fatal: true,
      });
      return z.NEVER;
    }
  }).superRefine(async ({ email, password }, ctx) => {
    const user = await db.user.findUnique({
      select: {
        id: true,
        password: true,
      },      
      where: {
        email,
      },
    });
    const ok = await bcrypt.compare(
      password,
      user!.password
    );    
    if (ok){
      const session = await getSession();
      session.id = user!.id;
      session.save();
      redirect("/user");
    } else {
      ctx.addIssue({
        code: "custom",
        message: "이메일 혹은 패스워드가 올바르지 않습니다.",
        path: ["password"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  ;

  const data = {
    email : formData.get("email"),
    password : formData.get("password"),
  };

  const result = await formSchema.safeParseAsync(data);
  if(!result.success){
    return result.error.flatten();
  }
}

export async function inviteUserToLedger(prevState: any, formData : FormData){
  const CheckIsExistsLedger = async() => {
    const ledger_id = formData.get("ledger_id");

    if (!ledger_id) {
      redirect("/ledger");
    }
  }
  
  CheckIsExistsLedger();

  const checkInvitedUser = async ( user_name:string | undefined) => {
    const user = await db.user.findUnique({
      select : { id:true },
      where : { user_name }
    });    
    return user?.id
  }

  const checkInvitingUser = async ( user_id: string, ledger_id : string ) => {
    const user = await db.user_ledger_invite.findFirst({
      select : { user_id : true, ledger_id : true, invite_prg_code: true },
      where : {
        user_id: user_id,
        ledger_id: ledger_id
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return user?.invite_prg_code;
  }

  const formSchema = z.object({
    user_name : z.string({
      invalid_type_error:"사용자명은 문자로 입력되어야 합니다.", 
      required_error:"사용자명은 필수입니다"})
      .min(1)
      .trim(),
    ledger_id : z.string(),
  })
  // 가계부 주인 여부 조회
  .superRefine(async ({ledger_id}, ctx) => {
    const user = await getSession();
    const isOwner = await db.user_ledger.findUnique({
      select : {
        user_id : true
      },      
      where : {
        user_id_ledger_id : {
          user_id : user.id,
          ledger_id : ledger_id,
        },
        is_owner : true
      }
    })
    if (!isOwner) {
      ctx.addIssue({
        code: "custom",
        message: "가계부의 주인만 초대 권한이 있습니다",
        path: ["user_name"],
        fatal: true,            
      })
    }
    return z.NEVER;    
  })
  // 초대 대상자 존재 여부 조회
  .superRefine(async ({user_name}, ctx) => {
    const exists_invited_user = await checkInvitedUser(user_name);
    if(!exists_invited_user){
      ctx.addIssue({
        code: "custom",
        message: "존재하지 않는 사용자 입니다",
        path: ["user_name"],
        fatal: true,        
      });
    }
    return z.NEVER;
  })
  // 초대 대상자가 자기 자신인지, 이미 초대중인지, 이미 초대가 완료됐는지 조회
  .superRefine(async ({user_name, ledger_id}, ctx) => {
    const user = await getUser();
    const invited_user_id = await checkInvitedUser(user_name);

    if(user.id === invited_user_id){
      ctx.addIssue({
        code: "custom",
        message: "자기 자신을 초대할 수 없습니다",
        path: ["user_name"],
        fatal: true,        
      });
    } 

    const inviting_user = await checkInvitingUser(invited_user_id as string, ledger_id)
    if(inviting_user === 0 || inviting_user === 3){
      ctx.addIssue({
        code: "custom",
        message: "이미 초대중인 사용자 입니다",
        path: ["user_name"],
        fatal: true,        
      });        
    } else if (inviting_user === 1){
      ctx.addIssue({
        code: "custom",
        message: "이미 초대가 완료된 사용자 입니다",
        path: ["user_name"],
        fatal: true,        
      });
    }
    return z.NEVER;    
  })
 
  const data = {
    user_name : formData.get("user_name"),
    ledger_id : formData.get("ledger_id"),
  }
  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const user_id = await checkInvitedUser(result.data.user_name);

    const inviteData = {
      user_id : user_id as string,
      ledger_id : result.data.ledger_id,
      invite_prg_code : 0
    }
  
    await db.user_ledger_invite.create({
      data: inviteData
    });
  
    redirect("/main");
  }
}

export async function createLedger(prevState: any, formData : FormData){
  const session = await getSession();
  const formSchema = z.object({
    ledger_name : z.string({
      invalid_type_error:"가계부 이름은 문자로 입력되어야 합니다.", 
      required_error:"가계부 이름은 필수입니다."})
      .min(1)
      .trim(),

    user_category_group_id : z.string(),
  });

  const data = {
    ledger_name : formData.get("ledger_name"),
    user_category_group_id : formData.get("user_category_group_id"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const ledger = await db.ledger.create({
      data: {
        ledger_name : result.data.ledger_name,
        user_category_group_id : result.data.user_category_group_id
      }
    });
    createUserLedger(session.id, ledger.id, false, true);
    revalidatePath("/ledger");
    redirect("/ledger");
  }
}

export async function createCategoryGroup(prevState: any, formData : FormData){
  const session = await getSession();
  const formSchema = z.object({
    category_group_name : z.string({
      invalid_type_error:"카테고리 그룹명은 문자로 입력되어야 합니다.", 
      required_error:"카테고리 그룹명은 필수입니다."})
      .min(1)
      .trim(),
  });

  const data = {
    category_group_name : formData.get("category_group_name"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    await db.user_category_group.create({
      data: {
        user_id : session.id,
        category_group_name : result.data.category_group_name,
      }
    });
    redirect("/ledger");
    
  }
}

async function createUserLedger(user_id : string, ledger_id : string, is_default : boolean, is_owner : boolean){
  await db.user_ledger.create({
    data: { 
      user_id : user_id,
      ledger_id : ledger_id,
      is_default : is_default,
      is_owner : is_owner
    }
  })
}

export async function smsSignIn(prevState : SmsTokenProps, formData : FormData){
  const phoneSchema = z
    .string()
    .trim()
    .refine((phone) => validator.isMobilePhone(phone, "ko-KR"));
  const tokenSchema = z
    .coerce
    .number()
    .min(100000)
    .max(999999)

  const phone = formData.get("phone");
  const token = formData.get("token");
  if(!prevState.token){
    const result = phoneSchema.safeParse(phone);
    if(!result.success){
      return {
        token : false,
        errors:result.error.flatten(),
      };
    } else {
      return {
        token : true,
      };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if(!result.success){
      return { 
        token : true,
        errors:result.error.flatten(),
      }
    } else {
      redirect("/");
    }
  }
}

export async function createDefaultLedger(user_id : string, user_category_group_id : string){
  const ledger = await db.ledger.create({
    data: {
      ledger_name : "기본 가계부",
      user_category_group_id : user_category_group_id
    }
  });

  await db.user_ledger.create({
    data: { 
      user_id : user_id,
      ledger_id : ledger.id,
      is_default : true,
      is_owner : true,
    }
  })
}

export async function createDefaultCategoryGroup(id : string){
  const user_category_group = await db.user_category_group.create({
    data: {
      user_id : id,
      category_group_name : "기본 카테고리",
    }
  });

  const user_category = await db.user_category.findMany({
    select : {
      id : true,
    },
    where: {
      user_id: id,
    },
  });

  await Promise.all(
    user_category.map(async (category) => {
      await db.user_category_group_rel.create({
        data: {
          user_category_group_id: user_category_group.id,
          user_category_id: category.id,
        },
      });
    })
  );  

  return user_category_group.id
}

export async function createLedgerDetail(prevState: any, formData : FormData){
  const formSchema = z.object({
    ledger_id : z.string(),
    asset_category_id : z.string(),
    transaction_category_id : z.string(),
    category_code : z.coerce.number(),
    title: z.string()
    .trim()
    .min(1, "제목은 1자 이상이어야 합니다."),

    detail: z.string()
    .trim()
    .min(1),

    price: z.coerce.bigint(),

    evented_at: z.date()
  })
  
  const data = {
    ledger_id: formData.get("ledger_id"),
    asset_category_id: formData.get("asset_category_id"),
    transaction_category_id: formData.get("transaction_category_id"),
    category_code: formData.get("category_code"),
    title : formData.get("title"),
    detail : formData.get("detail"),
    price : formData.get("price"),
    evented_at : new Date(Date.now()),
  }

  const result = await formSchema.safeParseAsync(data);
  if(!result.success){
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    const ledgerDetailData = {
      ledger_id : result.data.ledger_id,
      asset_category_id : result.data.asset_category_id,
      transaction_category_id : result.data.transaction_category_id,
      category_code : result.data.category_code,
      title : result.data.title,
      detail : result.data.detail,
      price : result.data.price,
      evented_at: new Date(Date.now())
    }

    await db.ledger_detail.create({
      data : ledgerDetailData
    });

    redirect(`/ledger/${data.ledger_id}`);
  }
}

  // 기본 상위 카테고리 데이터 조회
export async function createDefaultCategory(userId : string) {

  // 기본 상위 카테고리 데이터 조회
  const parentCategories = await db.category.findMany({
    where: { parent_id: null },
  });

  // 상위 카테고리를 복사하고, 새로 생성된 상위 카테고리 ID를 추적
  const newParentCategories = await Promise.all(
    parentCategories.map(async (category) => {
      const newCategory = await db.user_category.create({
        data: {
          user_id: userId,
          parent_id: null,
          category_name: category.category_name,
          category_code: category.category_code,
        },
      });
      return { oldId: category.id, newId: newCategory.id };
    })
  );

  // 모든 하위 카테고리 데이터 조회
  const childCategories = await db.category.findMany({
    where: { parent_id: { not: null } },
  });

  // 하위 카테고리를 복사하고, 상위 카테고리와 연결
  await Promise.all(
    childCategories.map(async (category) => {
      const parentIdMapping = newParentCategories.find(
        (mapping) => mapping.oldId === category.parent_id
      );
      if (parentIdMapping) {
        await db.user_category.create({
          data: {
            user_id: userId,
            parent_id: parentIdMapping.newId,
            category_name: category.category_name,
            category_code: category.category_code,
          },
        });
      }
    })
  );
}

export async function createInviteResponse(ledger_id : string, prg_code : number){
  const user = await getSession();
  await db.user_ledger_invite.create({
    data : {
      user_id : user.id,
      ledger_id : ledger_id,
      invite_prg_code : prg_code,
    }
  });

  if(prg_code === 1){
    await db.user_ledger.create({
      data : {
        user_id : user.id,
        ledger_id : ledger_id,
      }
    });
  }
}

export async function editLedger(prevState: any, formData : FormData){
  const formSchema = z.object({
    ledger_name : z.string({
      invalid_type_error:"가계부 이름은 문자로 입력되어야 합니다.", 
      required_error:"가계부 이름은 필수입니다."})
      .min(1)
      .trim(),

    ledger_id : z.string(),

    user_category_group_id : z.string(),
  });

  const data = {
    ledger_name : formData.get("ledger_name"),
    ledger_id : formData.get("ledger_id"),
    user_category_group_id : formData.get("user_category_group_id")
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    await db.ledger.update({
        where : {
          id : result.data.ledger_id
        },
        data : {
          ledger_name : result.data.ledger_name,
          user_category_group_id : result.data.user_category_group_id,
        }
    });
    redirect("/ledger"); 
  }
}

export async function setDefaultLedger(ledger_id : string){
  const user = await getSession();
    try{
      await db.user_ledger.updateMany({
        where : {
          user_id : user.id,
        },
        data : {
          is_default : false
        }
      });
    }catch(error){
      return { message : '기본 가계부 설정에 실패했습니다'}
    }

    try{
      await db.user_ledger.updateMany({
        where : {
          ledger_id : ledger_id
        },
        data : {
          is_default : true
        }
      });
    }catch(error){
      return { message : '기본 가계부 설정에 실패했습니다'}
    }
    
    redirect("/ledger"); 
}

export async function deleteLedger(ledger_id : string){
  const user = await getSession();
    try{
      await db.user_ledger.delete({
        where : {
          user_id_ledger_id : {
            user_id : user.id,
            ledger_id : ledger_id,
          },          
        }
      });
    }catch(error){
      return { message : '가계부 삭제에 실패했습니다'}
    }
    
    redirect("/ledger"); 
}

export async function expelUserFromLedger(ledger_id : string, user_id : string){
    try{
      await db.user_ledger.delete({
        where : {
          user_id_ledger_id : {
            user_id : user_id,
            ledger_id : ledger_id,
          },
        }
      });
    }catch(error){
      return { message : '사용자 추방에 실패했습니다'}
    }

    try{
      await db.user_ledger_invite.create({
        data: {
          user_id : user_id,
          ledger_id : ledger_id,
        }
      })
    }catch(error){
      return { message : '사용자 추방에 실패했습니다'}
    }
    
    redirect("/ledger"); 
}

export async function transferLedgerOwner(ledger_id : string, user_id : string){
  try{
    await db.user_ledger.updateMany({
      where : {
        ledger_id : ledger_id
      },
      data : {
        is_owner : false
      }
    });
  }catch(error){
    return { message : '가계부 권한 양도에 실패하였습니다'}
  }
  
  try{
    await db.user_ledger.update({
      where : {
        user_id_ledger_id : {
          user_id : user_id,
          ledger_id : ledger_id
        }
      },
      data : {
        is_owner : true
      }
    });
  }catch(error){
    return { message : '가계부 권한 양도에 실패하였습니다'}
  }
  
  redirect("/ledger"); 
}

export async function editLedgerDetail(prevState: any, formData : FormData){
  const formSchema = z.object({
    id : z.string(),
    ledger_id : z.string(),
    asset_category_id : z.string(),
    transaction_category_id : z.string(),
    category_code : z.coerce.number(),
    title: z.string()
    .trim()
    .min(1, "제목은 1자 이상이어야 합니다."),

    detail: z.string()
    .trim()
    .min(1),

    price: z.coerce.bigint(),

    evented_at: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date()
    ),
  })
  
  const data = {
    id : formData.get("id"),
    ledger_id: formData.get("ledger_id"),
    asset_category_id: formData.get("asset_category_id"),
    transaction_category_id: formData.get("transaction_category_id"),
    category_code: formData.get("category_code"),
    title : formData.get("title"),
    detail : formData.get("detail"),
    price : formData.get("price"),
    evented_at : formData.get("evented_at"),
  }

  const result = await formSchema.safeParseAsync(data);
  if(!result.success){
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    const ledgerDetailData = {
      ledger_id : result.data.ledger_id,
      asset_category_id : result.data.asset_category_id,
      transaction_category_id : result.data.transaction_category_id,
      category_code : result.data.category_code,
      title : result.data.title,
      detail : result.data.detail,
      price : result.data.price,
      evented_at: result.data.evented_at
    }
    await db.ledger_detail.update({
    where : {
      id : result.data.id
    },
    data : ledgerDetailData
  });

    redirect(`/ledger/${data.ledger_id}`);
  }
}

export async function deleteLedgerDetail(ledger_id : string, ledger_detail_id : string){
    try{
      await db.ledger_detail.delete({
        where : {
          id : ledger_detail_id
        }
      });
    }catch(error){
      return { message : '가계부 내역 삭제에 실패했습니다'}
    }
    
    redirect(`/ledger/${ledger_id}`);
}

export async function createCategory(prevState: any, formData : FormData){
  const session = await getSession();
  const formSchema = z.object({
    parent_id: z.preprocess(
      (val) => (val === 'null' || val === null ? null : val),
      z.string().nullable()
    ),
    category_name : z.string({
      invalid_type_error:"카테고리 이름은 문자로 입력되어야 합니다.", 
      required_error:"카테고리 이름은 필수입니다."})
      .min(1)
      .trim(),
    category_code : z.coerce.number(),
  });

  const data = {
    parent_id : formData.get("parent_id"),
    user_id : session.id,
    category_name : formData.get("category_name"),
    category_code : formData.get("category_code"),
  }

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    try{
      await db.user_category.create({
        data: {
          parent_id : result.data.parent_id,
          user_id : data.user_id,
          category_name : result.data.category_name,
          category_code : result.data.category_code
        }
      });
    }catch(error){
      throw new Error("카테고리 생성에 실패했습니다");
    }
    revalidatePath("/user/category/create-category");    
  }
}

export async function editCategory(prevState: any, formData : FormData){
  const formSchema = z.object({
    category_id : z.string(),
    category_name : z.string({
      invalid_type_error:"카테고리 이름은 문자로 입력되어야 합니다.", 
      required_error:"카테고리 이름은 필수입니다."})
      .min(1)
      .trim(),
  });

  const data = {
    category_id : formData.get("category_id"),
    category_name : formData.get("category_name"),
  }

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    try{
      await db.user_category.update({
        data: {
          category_name : result.data.category_name,
        },
        where : {
          id : result.data.category_id
        }
      });
    }catch(error){
      throw new Error("카테고리 수정에 실패했습니다");
    }
    redirect(`/user/category/`);    
  }
}

export async function deleteCategory(user_category_id : string){
  try{
    await db.user_category.update({
      data: {
        is_active : false,
      },
      where : {
        id : user_category_id
      }
    })
  }catch(error){
    return { message : '가계부 내역 삭제에 실패했습니다'}
  }
  
  revalidatePath(`/user/category/`);    
}

export async function createUserCategoryGroupRel(
  user_category_group_id: string,
  user_category_id: string)  {
  await db.user_category_group_rel.create({
    data: {
      user_category_id: user_category_id,
      user_category_group_id: user_category_group_id,
    },
  });
  revalidatePath("/user/category/category-group")
};

export async function deleteUserCategoryGroupRel(
  user_category_group_id: string,
  user_category_id: string
){
  await db.user_category_group_rel.delete({
    where: {
      user_category_group_id_user_category_id: {
        user_category_id: user_category_id,
        user_category_group_id: user_category_group_id,
      },
    },
  });
  revalidatePath("/user/category/category-group")
};

