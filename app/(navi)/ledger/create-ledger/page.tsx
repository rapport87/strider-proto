"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { createLedger } from "@/app/lib/actions";

export default function CreateLedger() {
  const [state, dispatch] = useFormState(createLedger, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">가계부 만들기</h1>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="ledger_name"
          type="text"
          placeholder="가계부 이름"
          required={true}
          errors={state?.fieldErrors.ledger_name}
        />
        <Input
          name="user_category_group_id"
          type="text"
          placeholder="사용자카테고리그룹ID"
          required={true}
          errors={state?.fieldErrors.user_category_group_id}
        />
        <Button text="가계부 생성하기" />
      </form>
    </div>
  );
}
