"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { createCategoryGroup } from "@/app/lib/actions";
import { UserIcon } from "@heroicons/react/24/solid";

export default function CreateCategoryGroup() {
  const [state, dispatch] = useFormState(createCategoryGroup, null);
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <UserIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">
          카테고리 그룹 만들기
        </h1>
      </div>
      <div className="mt-5">
        <form action={dispatch} className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="title"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              카테고리 그룹 이름
            </label>
            <Input
              name="categoryGroupName"
              type="text"
              placeholder="카테고리 그룹 이름"
              required={true}
              errors={state?.fieldErrors.categoryGroupName}
            />
          </div>
          <Button text="카테고리 그룹 생성하기" />
        </form>
      </div>
    </div>
  );
}
