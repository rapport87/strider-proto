"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { craeteLedger } from "@/app/lib/actions";

export default function CreateLedger() {
  const [state, dispatch] = useFormState(craeteLedger, null)
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">가계부 만들기</h1>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input 
            name="ledger_name"
            type="ledger_name" 
            placeholder="가계부 이름"
            required={true}
            errors={state?.fieldErrors.ledger_name}
        />
        <Button
            text="가계부 생성하기"
        />
      </form>
    </div>
  );
}