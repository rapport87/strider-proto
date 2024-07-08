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
  const checkUniqueEmail = async ( email : string ) => {
    const user = await db.user.findUnique({
      select : { id:true },
      where : { email }
    });    
    return !Boolean(user)
  }

  const checkUniqueUserName = async ( userName : string ) => {
    const user = await db.user.findUnique({
      select : { id:true },
      where : { user_name : userName }
    });    
    return !Boolean(user)
  }  

  const checkPasswordMatch = ({
    password,
    confirmPassword
  } : {
    password : string;
    confirmPassword : string;
  }) => password === confirmPassword
    

  const formSchema = z.object({
    email: z.string()
    .email()
    .toLowerCase()
    .refine(checkUniqueEmail, "이미 사용 중인 메일 주소입니다."),

    userName : z.string({
      invalid_type_error:"사용자명은 문자로 입력되어야 합니다.", 
      required_error:"사용자명은 필수입니다."})
      .min(1)
      .trim()
      .refine(checkUniqueUserName, "이미 사용 중인 사용자명 입니다."),
    
    password: z.string()
    .min(PASSWORD_MIN_LENGTH,"암호는 8자 이상이어야 합니다.")
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERR_MSG),

    confirmPassword: z.string()
    .min(PASSWORD_MIN_LENGTH,"암호는 8자 이상이어야 합니다."),
  }).refine(checkPasswordMatch, {
    message : "암호가 동일하지 않습니다",
    path : ["confirmPassword"],
  })
  
  const data = {
    email : formData.get("email"),
    userName : formData.get("userName"),
    password : formData.get("password"),
    confirmPassword : formData.get("confirmPassword"),
  }
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 8);
    const user = await db.user.create({
      data: {
        email : result.data.email,
        user_name : result.data.userName,
        password : hashedPassword,
      }
    });
    
    await createDefaultCategory(user.id);
    const userCategoryGroupId = await createDefaultCategoryGroup(user.id);
    await createDefaultLedger(user.id, userCategoryGroupId);
    
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
      await session.save();
      redirect("/main");
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
    const ledgerId = formData.get("ledgerId");

    if (!ledgerId) {
      redirect("/ledger");
    }
  }
  
  CheckIsExistsLedger();

  const checkInvitedUser = async ( userName : string | undefined) => {
    const user = await db.user.findUnique({
      select : { id:true },
      where : { user_name : userName }
    });    
    return user?.id
  }

  const checkInvitingUser = async ( userId: string, ledgerId : string ) => {
    const user = await db.user_ledger_invite.findFirst({
      select : { user_id : true, ledger_id : true, invite_prg_code: true },
      where : {
        user_id: userId,
        ledger_id: ledgerId
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return user?.invite_prg_code;
  }

  const formSchema = z.object({
    userName : z.string({
      invalid_type_error:"사용자명은 문자로 입력되어야 합니다.", 
      required_error:"사용자명은 필수입니다"})
      .min(1)
      .trim(),
    ledgerId : z.string(),
  })
  // 가계부 주인 여부 조회
  .superRefine(async ({ledgerId}, ctx) => {
    const user = await getSession();
    const isOwner = await db.user_ledger.findUnique({
      select : {
        user_id : true
      },      
      where : {
        user_id_ledger_id : {
          user_id : user.id,
          ledger_id : ledgerId,
        },
        is_owner : true
      }
    })
    if (!isOwner) {
      ctx.addIssue({
        code: "custom",
        message: "가계부의 주인만 초대 권한이 있습니다",
        path: ["userName"],
        fatal: true,            
      })
    }
    return z.NEVER;    
  })
  // 초대 대상자 존재 여부 조회
  .superRefine(async ({userName}, ctx) => {
    const exists_invited_user = await checkInvitedUser(userName);
    if(!exists_invited_user){
      ctx.addIssue({
        code: "custom",
        message: "존재하지 않는 사용자 입니다",
        path: ["userName"],
        fatal: true,        
      });
    }
    return z.NEVER;
  })
  // 초대 대상자가 자기 자신인지, 이미 초대중인지, 이미 초대가 완료됐는지 조회
  .superRefine(async ({userName, ledgerId}, ctx) => {
    const user = await getUser();
    const invitedUserId = await checkInvitedUser(userName);

    if(user.id === invitedUserId){
      ctx.addIssue({
        code: "custom",
        message: "자기 자신을 초대할 수 없습니다",
        path: ["userName"],
        fatal: true,        
      });
    } 

    const invitingUser = await checkInvitingUser(invitedUserId as string, ledgerId)
    console.log("invitedUserId : " + invitedUserId);
    console.log("ledgerId : " + ledgerId);
    if(invitingUser === 0 || invitingUser === 3){
      ctx.addIssue({
        code: "custom",
        message: "이미 초대중인 사용자 입니다",
        path: ["userName"],
        fatal: true,        
      });        
    } else if (invitingUser === 1){
      ctx.addIssue({
        code: "custom",
        message: "이미 초대가 완료된 사용자 입니다",
        path: ["userName"],
        fatal: true,        
      });
    }
    return z.NEVER;    
  })
 
  const data = {
    userName : formData.get("userName"),
    ledgerId : formData.get("ledgerId"),
  }
  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const userId = await checkInvitedUser(result.data.userName);

    const inviteData = {
      user_id : userId as string,
      ledger_id : result.data.ledgerId,
      invite_prg_code : 0
    }
  
    await db.user_ledger_invite.create({
      data: inviteData
    });
  
    redirect("/ledger");
  }
}

export async function createLedger(prevState: any, formData : FormData){
  const session = await getSession();
  const formSchema = z.object({
    ledgerName : z.string({
      invalid_type_error:"가계부 이름은 문자로 입력되어야 합니다.", 
      required_error:"가계부 이름은 필수입니다."})
      .min(1)
      .trim(),

    userCategoryGroupId : z.string(),
  });

  const data = {
    ledgerName : formData.get("ledgerName"),
    userCategoryGroupId : formData.get("userCategoryGroupId"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const ledger = await db.ledger.create({
      data: {
        user_category_group_id : result.data.userCategoryGroupId
      }
    });
    await createUserLedger(session.id, ledger.id, result.data.ledgerName, false, true);
    revalidatePath("/ledger");
    redirect("/ledger");
  }
}

export async function createCategoryGroup(prevState: any, formData : FormData){
  const session = await getSession();
  const formSchema = z.object({
    categoryGroupName : z.string({
      invalid_type_error:"카테고리 그룹명은 문자로 입력되어야 합니다.", 
      required_error:"카테고리 그룹명은 필수입니다."})
      .min(1)
      .trim(),
  });

  const data = {
    categoryGroupName : formData.get("categoryGroupName"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    await db.user_category_group.create({
      data: {
        user_id : session.id,
        category_group_name : result.data.categoryGroupName,
      }
    });
    redirect("/user/category/category-group");
    
  }
}

async function createUserLedger(userId : string, ledgerId : string, ledgerName : string, isDefault : boolean, isOwner : boolean){
  await db.user_ledger.create({
    data: { 
      user_id : userId,
      ledger_id : ledgerId,
      ledger_name : ledgerName,
      is_default : isDefault,
      is_owner : isOwner
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

export async function createDefaultLedger(userId : string, userCategoryGroupId : string){
  const ledger = await db.ledger.create({
    data: {
      user_category_group_id : userCategoryGroupId
    }
  });

  await db.user_ledger.create({
    data: { 
      user_id : userId,
      ledger_id : ledger.id,
      ledger_name : "기본 가계부",
      is_default : true,
      is_owner : true,
    }
  })
}

export async function createDefaultCategoryGroup(id : string){
  const userCategoryGroup = await db.user_category_group.create({
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
          user_category_group_id: userCategoryGroup.id,
          user_category_id: category.id,
        },
      });
    })
  );  

  return userCategoryGroup.id
}

export async function createLedgerDetail(prevState: any, formData : FormData){
  const formSchema = z.object({
    ledgerId : z.string(),
    assetCategoryId : z.string(),
    transactionCategoryId : z.string(),
    categoryCode : z.coerce.number(),
    title: z.string()
    .trim()
    .min(1, "제목은 1자 이상이어야 합니다."),

    detail: z.string()
    .trim()
    .min(1),

    price: z.coerce.bigint(),

    eventedAt: z.date()
  })
  
  const data = {
    ledgerId: formData.get("ledgerId"),
    assetCategoryId: formData.get("assetCategoryId"),
    transactionCategoryId: formData.get("transactionCategoryId"),
    categoryCode: formData.get("categoryCode"),
    title : formData.get("title"),
    detail : formData.get("detail"),
    price : formData.get("price"),
    eventedAt : new Date(Date.now()),
  }

  const result = await formSchema.safeParseAsync(data);
  if(!result.success){
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    const ledgerDetailData = {
      ledger_id : result.data.ledgerId,
      asset_category_id : result.data.assetCategoryId,
      transaction_category_id : result.data.transactionCategoryId,
      category_code : result.data.categoryCode,
      title : result.data.title,
      detail : result.data.detail,
      price : result.data.price,
      evented_at: new Date(Date.now())
    }

    await db.ledger_detail.create({
      data : ledgerDetailData
    });

    redirect(`/ledger/${ledgerDetailData.ledger_id}`);
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

export async function createInviteResponse(ledgerId : string, prgCode : number){
  const user = await getSession();
  await db.user_ledger_invite.create({
    data : {
      user_id : user.id,
      ledger_id : ledgerId,
      invite_prg_code : prgCode,
    }
  });

  if(prgCode === 1){
    const userLedger = await db.user_ledger.findFirst({
      where : {
        is_owner : true,
        ledger_id : ledgerId,
      },
      select : {
        ledger_name : true
      }
    })

    if (userLedger){
      await db.user_ledger.create({
        data : {
          user_id : user.id,
          ledger_id : ledgerId,
          ledger_name : userLedger.ledger_name
        }
      });
    }
  }
  revalidatePath("/ledger");
}

export async function editLedger(prevState: any, formData : FormData){
  const user = await getSession();

  const formSchema = z.object({
    ledgerName : z.string({
      invalid_type_error:"가계부 이름은 문자로 입력되어야 합니다.", 
      required_error:"가계부 이름은 필수입니다."})
      .min(1)
      .trim(),

    ledgerId : z.string(),

    userCategoryGroupId : z.string(),
  });

  const data = {
    ledgerName : formData.get("ledgerName"),
    ledgerId : formData.get("ledgerId"),
    userCategoryGroupId : formData.get("userCategoryGroupId")
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    try{
      await db.ledger.update({
        where : {
          id : result.data.ledgerId
        },
        data : {
          user_category_group_id : result.data.userCategoryGroupId,
        }
      });
    } catch(error){
      throw new Error("가계부 카테고리 그룹 변경에 실패하였습니다.");
    }

    try{
      await db.user_ledger.update({
        where : {
          user_id_ledger_id : {
            user_id : user.id,
            ledger_id : result.data.ledgerId
          }
        },
        data : {
          ledger_name : result.data.ledgerName,
        }
      });
    } catch(error){
      throw new Error("가계부 카테고리 그룹 변경에 실패하였습니다.");
    }    
    redirect("/ledger"); 
  }
}

export async function setDefaultLedger(ledgerId : string){
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
          ledger_id : ledgerId
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

export async function deleteLedger(ledgerId : string){
  const user = await getSession();
    try{
      await db.user_ledger.delete({
        where : {
          user_id_ledger_id : {
            user_id : user.id,
            ledger_id : ledgerId,
          },          
        }
      });
    }catch(error){
      return { message : '가계부 삭제에 실패했습니다'}
    }
    
    redirect("/ledger"); 
}

export async function expelUserFromLedger(ledgerId : string, userId : string){
    try{
      await db.user_ledger.delete({
        where : {
          user_id_ledger_id : {
            user_id : userId,
            ledger_id : ledgerId,
          },
        }
      });
    }catch(error){
      return { message : '사용자 추방에 실패했습니다'}
    }

    try{
      await db.user_ledger_invite.create({
        data: {
          user_id : userId,
          ledger_id : ledgerId,
          invite_prg_code : 2
        }
      })
    }catch(error){
      return { message : '사용자 추방에 실패했습니다'}
    }
    
    revalidatePath("/ledger/[ledgerId]/edit"); 
}

export async function transferLedgerOwner(ledgerId : string, userId : string){
  try{
    await db.user_ledger.updateMany({
      where : {
        ledger_id : ledgerId
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
          user_id : userId,
          ledger_id : ledgerId
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
    ledgerId : z.string(),
    assetCategoryId : z.string(),
    transactionCategoryId : z.string(),
    categoryCode : z.coerce.number(),
    title: z.string()
    .trim()
    .min(1, "제목은 1자 이상이어야 합니다."),

    detail: z.string()
    .trim()
    .min(1),

    price: z.coerce.bigint(),

    eventedAt: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date()
    ),
  })
  
  const data = {
    id : formData.get("id"),
    ledgerId: formData.get("ledgerId"),
    assetCategoryId: formData.get("assetCategoryId"),
    transactionCategoryId: formData.get("transactionCategoryId"),
    categoryCode: formData.get("categoryCode"),
    title : formData.get("title"),
    detail : formData.get("detail"),
    price : formData.get("price"),
    eventedAt : formData.get("eventedAt"),
  }

  const result = await formSchema.safeParseAsync(data);
  if(!result.success){
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    const ledgerDetailData = {
      ledger_id : result.data.ledgerId,
      asset_category_id : result.data.assetCategoryId,
      transaction_category_id : result.data.transactionCategoryId,
      category_code : result.data.categoryCode,
      title : result.data.title,
      detail : result.data.detail,
      price : result.data.price,
      evented_at: result.data.eventedAt
    }
    await db.ledger_detail.update({
    where : {
      id : result.data.id
    },
    data : ledgerDetailData
  });

    redirect(`/ledger/${ledgerDetailData.ledger_id}`);
  }
}

export async function deleteLedgerDetail(ledgerId : string, ledgerDetailId : string){
    try{
      await db.ledger_detail.delete({
        where : {
          id : ledgerDetailId
        }
      });
    }catch(error){
      return { message : '가계부 내역 삭제에 실패했습니다'}
    }
    
    redirect(`/ledger/${ledgerId}`);
}

export async function createCategory(prevState: any, formData : FormData){
  const session = await getSession();
  const formSchema = z.object({
    parentId: z.preprocess(
      (val) => (val === 'null' || val === null ? null : val),
      z.string().nullable()
    ),
    categoryName : z.string({
      invalid_type_error:"카테고리 이름은 문자로 입력되어야 합니다.", 
      required_error:"카테고리 이름은 필수입니다."})
      .min(1)
      .trim(),
    categoryCode : z.coerce.number(),
  });

  const data = {
    parentId : formData.get("parentId"),
    categoryName : formData.get("categoryName"),
    categoryCode : formData.get("categoryCode"),
  }

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    try{
      await db.user_category.create({
        data: {
          parent_id : result.data.parentId,
          user_id : session.id,
          category_name : result.data.categoryName,
          category_code : result.data.categoryCode
        }
      });
    }catch(error){
      throw new Error("카테고리 생성에 실패했습니다");
    }
    redirect(`/user/category/`);
  }
}

export async function editCategory(prevState: any, formData : FormData){
  const formSchema = z.object({
    categoryId : z.string(),
    categoryName : z.string({
      invalid_type_error:"카테고리 이름은 문자로 입력되어야 합니다.", 
      required_error:"카테고리 이름은 필수입니다."})
      .min(1)
      .trim(),
  });

  const data = {
    categoryId : formData.get("categoryId"),
    categoryName : formData.get("categoryName"),
  }

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    try{
      await db.user_category.update({
        data: {
          category_name : result.data.categoryName,
        },
        where : {
          id : result.data.categoryId
        }
      });
    }catch(error){
      throw new Error("카테고리 수정에 실패했습니다");
    }
    redirect(`/user/category/`);
  }
}

export async function deleteCategory(userCategoryId : string){
  try{
    await db.user_category.update({
      data: {
        is_active : false,
      },
      where : {
        id : userCategoryId
      }
    })
  }catch(error){
    return { message : '가계부 내역 삭제에 실패했습니다'}
  }
  
  revalidatePath(`/user/category/`);    
}

export async function createUserCategoryGroupRel(
  userCategoryGroupId: string,
  userCategoryId: string
){
  await db.user_category_group_rel.create({
    data: {
      user_category_id: userCategoryId,
      user_category_group_id: userCategoryGroupId,
    },
  });

  revalidatePath("/user/category/category-group")
};

export async function deleteUserCategoryGroupRel(
  userCategoryGroupId: string,
  userCategoryId: string
){
  await db.user_category_group_rel.delete({
    where: {
      user_category_group_id_user_category_id: {
        user_category_id: userCategoryId,
        user_category_group_id: userCategoryGroupId,
      },
    },
  });
 
  revalidatePath("/user/category/category-group")
};

