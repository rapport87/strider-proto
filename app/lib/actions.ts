"use server";
import {z} from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERR_MSG } from "@/app/lib/constants";
import validator from "validator";
import { SmsTokenProps } from "@/app/lib/defenitions";
import { redirect, useParams } from "next/navigation";
import bcrypt from "bcrypt"
import db from "@/app/lib/db";
import getSession from "@/app/lib/session";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";


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
  }) => password === confirm_password;

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
    createDefaultLedger(user.id);
    copyCategory(user.id);
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/profile");
  }
}  

export async function inviteUser(prevState: any, formData : FormData){
  const CheckIsExistsLedger = async() => {
    const ledger_id = formData.get("ledger_id");

    if (!ledger_id || isNaN(Number(ledger_id))) {
      alert("잘못된 요청입니다");
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

  const checkInvitingUser = async ( user_id:number, ledger_id : number ) => {
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
    ledger_id : z.coerce.number(),
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
          ledger_id : Number(ledger_id),
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

    const inviting_user = await checkInvitingUser(invited_user_id as number, ledger_id)
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
    const user_id = await checkInvitedUser(result.data.user_name) as number;

    const inviteData = {
      user_id : user_id,
      ledger_id : result.data.ledger_id,
      invite_prg_code : 0
    }
  
    await db.user_ledger_invite.create({
      data: inviteData
    });
  
    redirect("/main");
  }
}

export async function craeteLedger(prevState: any, formData : FormData){
  const session = await getSession();
  const formSchema = z.object({
    ledger_name : z.string({
      invalid_type_error:"가계부 이름은 문자로 입력되어야 합니다.", 
      required_error:"가계부 이름은 필수입니다."})
      .min(1)
      .trim(),
  });

  const data = {
    ledger_name : formData.get("ledger_name"),
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const ledger = await db.ledger.create({
      data: {
        ledger_name : result.data.ledger_name,
      }
    });
    createUserLedger(session.id, ledger.id, false, true);
    redirect("/ledger");
    
  }
}

async function createUserLedger(user_id : number, ledger_id : number, is_default : boolean, is_owner : boolean){
  await db.user_ledger.create({
    data: { 
      user_id : user_id,
      ledger_id : ledger_id,
      is_default : is_default,
      is_owner : is_owner
    }
  })
}


async function changeDefaultLedger(user_id : number){
  await db.user_ledger.updateMany({
    where : {
      user_id : user_id,
      is_default : true,
    },
    data : {
      is_default : false,
    }
  });
}

export async function login(prevState: any, formData : FormData){
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
      redirect("/profile");
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

export async function smsLogin(prevState : SmsTokenProps, formData : FormData){
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

export async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

export async function createDefaultLedger(id : number){
  const ledger = await db.ledger.create({
    data: {
      ledger_name : "기본 가계부"
    }
  });

  await db.user_ledger.create({
    data: { 
      user_id : id,
      ledger_id : ledger.id,
      is_default : true,
      is_owner : true,
    }
  })
}

export async function writeLedgerDeatil(prevState: any, formData : FormData){
  const formSchema = z.object({
    ledger_id : z.coerce.number(),
    asset_category_id : z.coerce.number(),
    transaction_category_id : z.coerce.number(),
    category_code : z.coerce.number(),
    title: z.string()
    .trim()
    .min(1, "제목은 1자 이상이어야 합니다."),

    detail: z.string()
    .trim()
    .min(1),

    price: z.coerce.number(),

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
export async function copyCategory(userId : number) {

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

export async function getUserCategory(categoryCode? : number){
  const session = await getSession();
  if (session.id) {
    const whereClause = {
      user_id: session.id,
      category_code: categoryCode !== undefined ? { in: [0, categoryCode] } : 0,
    };

    const category = await db.user_category.findMany({
      select: {
        id: true,
        parent_id: true,
        category_code: true,
        category_name: true,
        is_active: true
      },
      where: whereClause,
    });

    if (category) {
      return category;
    }    
  }
  notFound();
}

export async function existsInvite(){
//   SELECT t1.user_id, t1.ledger_id, t1.invite_prg_code, t1.created_at, t1.updated_at
//     FROM user_ledger_invite t1
//    INNER JOIN (
//                SELECT user_id, ledger_id, MAX(created_at) AS max_created_at
//                  FROM user_ledger_invite
//                 GROUP BY user_id, ledger_id
//               ) t2
//            ON t1.ledger_id = t2.ledger_id
//           AND t1.user_id = t2.user_id
//           AND t1.created_at = t2.max_created_at;  
  
  const user = await getSession();
  const subquery = await db.user_ledger_invite.groupBy({
    by: ['user_id', 'ledger_id'],
    _max: {
      created_at: true,
    },
    where: {
      user_id: user.id,
    },    
  });

  const result = await db.user_ledger_invite.findMany({
    where: {
      OR: subquery.map((row) => ({
        user_id: row.user_id,
        ledger_id: row.ledger_id,
        created_at: row._max.created_at as Date,
      })),
      invite_prg_code : 0
    },
    include: {
      ledger: {
        select: {
          ledger_name: true,
        },
      },
    },    
  });

  return result.map(invite => ({
    id : invite.id,
    user_id: invite.user_id,
    ledger_id: invite.ledger_id,
    invite_prg_code: invite.invite_prg_code,
    created_at: invite.created_at,
    updated_at: invite.updated_at,
    ledger_name: invite.ledger.ledger_name,
  }));
}

export async function inviteRequest(ledger_id : number, prg_code : number){
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

export async function getLedger(ledger_id : number){
  const ledger = await db.ledger.findUnique({
    where: {
      id : Number(ledger_id)
    },
    select: {
      id : true,
      ledger_name : true,
      userLedger : {
        select : {
          user_id : true,
          is_owner : true,
          is_default : true,
        },
      }
    }
  })
  return ledger;
}

export async function getLedgers(){
  const user = await getSession();
  const ledger = await db.user_ledger.findMany({
    where: {
      user_id : user.id
    },
    include: {
      ledger: {
        select: {
          ledger_name: true,
        },
      },    
    }
  })
  return ledger.map((userLedger) => ({
    user_id: userLedger.user_id,
    ledger_id : userLedger.ledger_id,
    ledger_name : userLedger.ledger.ledger_name,
    is_default : userLedger.is_default,
    is_owner : userLedger.is_owner
  }));  
}

export async function getLedgerDetails(ledger_id : number){
//   SELECT ld.*
//   FROM ledger_detail ld
//  INNER JOIN ledger l ON l.id = ld.ledger_id
//  INNER JOIN user_ledger ul ON ul.ledger_id = l.id
//         AND ul.user_id = 1
//   LEFT JOIN user_category uc ON ld.asset_category_id = uc.category_code
//   LEFT JOIN user_category ac ON ld.transaction_category_id = uc.category_code
//  ORDER BY ld.evented_at DESC;  

  const user = await getSession();
  const ledgerDetails = await db.ledger_detail.findMany({
    where: {
      ledger_id : Number(ledger_id),
      ledger: {
        userLedger: {
          some: {
            user_id: user.id,
          },
        },
      },
    },
    orderBy: {
      evented_at: 'desc',
    },        
    include: {
      asset_category: {
        select: {
          category_name: true,
        },
      },
      transaction_category: {
        select: {
          category_name: true,
        },
      },
    },        
  });

  return ledgerDetails.map((detail) => ({
    id: detail.id,
    asset_category_id: detail.asset_category_id,
    transaction_category_id: detail.transaction_category_id,
    category_code: detail.category_code,
    title: detail.title,
    price: detail.price,
    evented_at: detail.evented_at,
    asset_category_name: detail.asset_category.category_name,
    transaction_category_name: detail.transaction_category.category_name,
  }));
}

export async function updateLedger(prevState: any, formData : FormData){
  const session = await getSession();
  const formSchema = z.object({
    ledger_name : z.string({
      invalid_type_error:"가계부 이름은 문자로 입력되어야 합니다.", 
      required_error:"가계부 이름은 필수입니다."})
      .min(1)
      .trim(),

    ledger_id : z.coerce.number(),
  });

  const data = {
    ledger_name : formData.get("ledger_name"),
    ledger_id : formData.get("ledger_id")
  };

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const ledger = await db.ledger.update({
        where : {
          id : result.data.ledger_id
        },
        data : {
          ledger_name : result.data.ledger_name,
        }
    });
    redirect("/ledger"); 
  }
}

export async function setDefaultLedger(ledger_id : number){
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
