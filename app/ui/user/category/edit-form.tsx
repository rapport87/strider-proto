"use client";

import { editCategory } from "@/app/lib/actions";
import { UserCategory } from "@/app/lib/defenitions";
import Button from "@/app/ui/components/button";
import Input from "@/app/ui/components/input";
import { useFormState } from "react-dom";

export default function EditCategoryForm({
  category,
}: {
  category: UserCategory;
}) {
  const [state, dispatch] = useFormState(editCategory, null);
  return (
    <div className="mt-3">
      <form action={dispatch}>
        <div className="mt-3">
          <label
            htmlFor="categoryName"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            카테고리 이름
          </label>
          <Input
            name="categoryName"
            type="text"
            placeholder="카테고리 이름"
            required={true}
            defaultValue={category.category_name}
            errors={state?.fieldErrors?.categoryName}
          />
        </div>
        <div className="mt-3">
          <Button text="카테고리 수정" />
        </div>
        <input name="categoryId" value={category.id} type="hidden" />
      </form>
    </div>
  );
}
