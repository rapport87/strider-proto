"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { createCategoryGroup } from "@/app/lib/actions";

export default function CreateCategoryGroup() {
  const [state, dispatch] = useFormState(createCategoryGroup, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">카테고리 그룹 만들기</h1>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="categoryGroupName"
          type="text"
          placeholder="카테고리 그룹명"
          required={true}
          errors={state?.fieldErrors.categoryGroupName}
        />
        <Button text="카테고리 그룹 생성하기" />
      </form>
    </div>
  );
}
