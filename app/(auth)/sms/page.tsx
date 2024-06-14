"use client";

import Button from "@/app/ui/components/button";
import Input from "@/app/ui/components/input";
import { useFormState } from "react-dom";
import { smsSignIn } from "@/app/lib/actions";

export default function Page() {
  const initialState = {
    token: false,
    errors: undefined,
  };
  const [state, dispatch] = useFormState(smsSignIn, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {state.token ? (
          <Input
            name="token"
            type="number"
            placeholder="Verification code"
            min={100000}
            max={999999}
            required
          />
        ) : (
          <Input
            name="phone"
            type="text"
            placeholder="Phone number"
            errors={state.errors?.formErrors}
            required
          />
        )}
        <Button text={state.token ? "인증하기" : "인증번호 받기"} />
      </form>
    </div>
  );
}
