"use client";

import FormButton from "@/app/ui/components/form-btn";
import FormInput from "@/app/ui/components/form-input";
import SocialLogin from "@/app/ui/components/social-login";
import { useFormState } from "react-dom";
import { handleForm } from "@/app/lib/actions";

export default function LogIn() {
  const [state, dispatch] = useFormState(handleForm, null)
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">로그인</h1>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <FormInput 
          name="email" 
          type="email" 
          placeholder="Email" 
          required 
          errors={state?.errors ?? []} />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.errors ?? []}
        />
        <FormButton text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
}