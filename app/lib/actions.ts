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
    const session = await getSession();
    session.id = user.id;
    await session.save();
    redirect("/profile");
  }
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