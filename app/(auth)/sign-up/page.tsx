"use client";

import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { signUp } from "@/app/lib/actions";
import { UserIcon } from "@heroicons/react/24/solid";

export default function Page() {
  const [state, dispatch] = useFormState(signUp, null);
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <UserIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">회원가입</h1>
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
              required={true}
              errors={state?.fieldErrors.email}
            />
          </div>
          <div>
            <label
              htmlFor="userName"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              사용자 이름
            </label>
            <Input
              name="userName"
              type="text"
              placeholder="Name"
              required={true}
              minLength={1}
              maxLength={12}
              errors={state?.fieldErrors.userName}
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
              required={true}
              minLength={10}
              errors={state?.fieldErrors.password}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              비밀번호 확인
            </label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required={true}
              minLength={10}
              errors={state?.fieldErrors.confirmPassword}
            />
          </div>
          <Button text="계정 생성하기" />
        </form>
      </div>
      {/* <div className="w-full h-px bg-neutral-500" />
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
      </div> */}
    </div>
  );
}
