"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { inviteUser } from "@/app/lib/actions";

export default function Invite({params} : {params: {id:number}}) {
  const [state, dispatch] = useFormState(inviteUser, null)
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">가계부 초대하기</h1>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
            name="user_name"
            type="text" 
            placeholder="사용자명"
            required={true}
            errors={state?.fieldErrors.user_name}
        />
        <input
            name="ledger_id"
            value={params.id}
            type="hidden"
        />        
        <Button
            text="가계부 초대하기"
        />
      </form>
    </div>
  );
}