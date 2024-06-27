"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { inviteUserToLedger } from "@/app/lib/actions";
import { WalletIcon } from "@heroicons/react/24/solid";
import { getLedgerById } from "@/app/lib/data";

export default function Page({ params }: { params: { ledgerId: number } }) {
  const [state, dispatch] = useFormState(inviteUserToLedger, null);

  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <WalletIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">가계부 초대</h1>
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
