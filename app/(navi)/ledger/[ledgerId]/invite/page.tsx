"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { inviteUserToLedger } from "@/app/lib/actions";

export default function Page({ params }: { params: { ledgerId: number } }) {
  const [state, dispatch] = useFormState(inviteUserToLedger, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">가계부 초대하기</h1>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="userName"
          type="text"
          placeholder="사용자명"
          required={true}
          errors={state?.fieldErrors.userName}
        />
        <input name="ledgerId" value={params.ledgerId} type="hidden" />
        <Button text="가계부 초대하기" />
      </form>
    </div>
  );
}
