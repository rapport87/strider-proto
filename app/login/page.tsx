"use client";

import Button from "@/app/ui/components/button";
import Input from "@/app/ui/components/input";
import SocialLogin from "@/app/ui/components/social-login";
import { useFormState } from "react-dom";
import { login } from "@/app/lib/actions";

export default function LogIn() {
  const [state, dispatch] = useFormState(login, null)
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">로그인</h1>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input 
          name="email" 
          type="email" 
          placeholder="E-mail" 
          required 
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors.password}
        />
        <Button text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
}