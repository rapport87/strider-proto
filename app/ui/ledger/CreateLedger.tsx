"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { createLedger } from "@/app/lib/actions";
import { CategoryGroupProps } from "@/app/lib/defenitions";

export default function CreateLedger({ categoryGroup }: CategoryGroupProps) {
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
        <div>
          <select
            className="w-full h-10"
            name="user_category_group_id"
            required
          >
            {categoryGroup.map((catGrp) => (
              <option key={catGrp.id} value={catGrp.id}>
                {catGrp.category_group_name}
              </option>
            ))}
          </select>
        </div>
        <Button text="가계부 생성하기" />
      </form>
    </div>
  );
}
