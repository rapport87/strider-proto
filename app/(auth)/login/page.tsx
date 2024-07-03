"use client";

import Button from "@/app/ui/components/button";
import Input from "@/app/ui/components/input";
import SocialLogin from "@/app/ui/components/social-login";
import { useFormState } from "react-dom";
import { signIn } from "@/app/lib/actions";
import { UserIcon } from "@heroicons/react/24/solid";

export default function Page() {
  const [state, dispatch] = useFormState(signIn, null);
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <UserIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">로그인</h1>
      </div>
      <div className="mt-5">
        <form action={dispatch} className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              이메일
            </label>
            <Input
              name="email"
              type="email"
              placeholder="E-mail"
              required
              errors={state?.fieldErrors.email}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              비밀번호
            </label>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
              errors={state?.fieldErrors.password}
            />
          </div>
          <Button text="로그인" />
        </form>
      </div>
      {/* <SocialLogin /> */}
    </div>
  );
}
