"use server";
import {z} from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERR_MSG } from "@/app/lib/constants";
import validator from "validator";
import { SmsTokenProps } from "@/app/lib/defenitions";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt"
import db from "@/app/lib/db";
import getSession from "@/app/lib/session";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";

export async function signUp(prevState: any, formData : FormData){
  const checkUniqueEmail = async ( email:string ) => {
    const user = await db.user.findUnique({
      select : { id:true },
      where : { email }
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
      .trim(),
    
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
    setDefaultLedger(user.id);
    copyCategory(user.id);
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/profile");
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
    setUserLedger(session.id, ledger.id, false);
    redirect("/ledger");
    
  }
}

async function setUserLedger(user_id : number, ledger_id : number, is_default : boolean){
  await db.user_ledger.create({
    data: { 
      user_id : user_id,
      ledger_id : ledger_id,
      is_default : is_default
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

export async function setDefaultLedger(id : number){
  const ledger = await db.ledger.create({
    data: {
      ledger_name : "기본 가계부"
    }
  });

  await db.user_ledger.create({
    data: { 
      user_id : id,
      ledger_id : ledger.id,
      is_default : true
    }
  })
}

export async function setLedgerDeatil(prevState: any, formData : FormData){
  const formSchema = z.object({
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
    const session = await getSession();

    const getUserLedger = await db.ledger.findFirst({
      select : {
        id : true
      },      
      where : {
        id:session.id
      },
    });

    console.log(session.id);

    if(!getUserLedger){
      return;
    }
    const ledgerId = getUserLedger.id

    const ledgerDetailData = {
      ledger_id : ledgerId,
      asset_category_id : result.data.asset_category_id,
      transaction_category_id : result.data.transaction_category_id,
      category_code : result.data.category_code,
      title : result.data.title,
      detail : result.data.detail,
      price : result.data.price,
      evented_at: new Date(Date.now())
    }

    console.log(ledgerDetailData);

    await db.ledger_detail.create({
      data : ledgerDetailData
    });

    redirect("/main");
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

export async function getLedger(){
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
    is_default : userLedger.is_default
  }));  
}

export async function getLedgerDetails(){
  const user = await getSession();
  const ledgerDetails = await db.ledger_detail.findMany({
    where: {
        ledger: {
          userLedger: {
            every: {
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

// export async function getUserCategory(selectedCategoryId? : number) {
//   const session = await getSession();
//   if (session.id) {

//     const whereClause: {
//       user_id: number;
//       parent_id?: number | null;
//     } = {
//       user_id: session.id,
//     };

//     if (selectedCategoryId !== undefined) {
//       whereClause.parent_id = selectedCategoryId;
//     }

//     const category = await db.user_category.findMany({
//       select : {
//         id : true,
//         parent_id : true,
//         category_code : true,
//         category_name : true,
//       },
//       where: whereClause
//     });
//     if (category) {
//       return category;
//     }
//   }
//   notFound();
// }