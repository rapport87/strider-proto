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
        <h1 className="ml-1 font-extrabold text-2xl">가계부 초대</h1>
      </div>
      <form action={dispatch} className="flex flex-col gap-3 mt-3">
        <div className="mt-3">
          <label
            htmlFor="userName"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            사용자 이름
          </label>
          <Input
            name="userName"
            type="text"
            placeholder="사용자 이름"
            required={true}
            errors={state?.fieldErrors.userName}
          />
        </div>
        <input name="ledgerId" value={params.ledgerId} type="hidden" />
        <div>
          <Button text="가계부 초대하기" />
        </div>
      </form>
    </div>
  );
}
