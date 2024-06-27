"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { createLedger } from "@/app/lib/actions";
import { CreateLedgerProps } from "@/app/lib/defenitions";
import { WalletIcon } from "@heroicons/react/24/solid";

export default function CreateLedgerForm({
  category_group,
}: CreateLedgerProps) {
  const [state, dispatch] = useFormState(createLedger, null);
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <WalletIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl">가계부 만들기</h1>
      </div>
      <form action={dispatch} className="flex flex-col gap-3 mt-3">
        <div className="mt-3">
          <label
            htmlFor="ledgerName"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            가계부 이름
          </label>
          <Input
            name="ledgerName"
            type="text"
            placeholder="가계부 이름"
            required={true}
            errors={state?.fieldErrors.ledgerName}
          />
        </div>
        <div className="mt-3">
          <label
            htmlFor="userCategoryGroupId"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            카테고리
          </label>
          <select
            className="w-block w-full h-10 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500"
            name="userCategoryGroupId"
            required
          >
            {category_group.map((catGrp) => (
              <option key={catGrp.id} value={catGrp.id}>
                {catGrp.category_group_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Button text="가계부 만들기" />
        </div>
      </form>
    </div>
  );
}
