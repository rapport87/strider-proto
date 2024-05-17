"use client";

import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { signUp } from "@/app/lib/actions";

export default function SignUp() {
  const [state, dispatch] = useFormState(signUp, null)
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">회원가입</h1>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input 
            name="email"
            type="email" 
            placeholder="E-mail" 
            required={true}
            errors={state?.fieldErrors.email}
        />
        <Input 
            name="username"
            type="text" 
            placeholder="Username" 
            required={true}
            minLength={1}
            maxLength={12}                        
            errors={state?.fieldErrors.username}
        />
        <Input 
            name="password"
            type="password" 
            placeholder="Password" 
            required={true}
            minLength={10}
            errors={state?.fieldErrors.password}
        />
        <Input 
            name="confirm_password"
            type="password" 
            placeholder="Confirm Password" 
            required={true}
            minLength={10}
            errors={state?.fieldErrors.confirm_password}
        />                        
        <Button
            text="계정 생성하기"
        />
      </form>
      <div className="w-full h-px bg-neutral-500" />
      <div>
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-2"
          href="/sms"
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
          </span>
          <span>휴대전화(SMS) 회원가입</span>
        </Link>
      </div>
    </div>
  );
}