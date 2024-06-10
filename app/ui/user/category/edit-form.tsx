"use client";

import { editCategory } from "@/app/lib/actions";
import { Category } from "@/app/lib/defenitions";
import Button from "@/app/ui/components/button";
import Input from "@/app/ui/components/input";
import { useFormState } from "react-dom";

export default function EditCategoryForm({ category }: { category: Category }) {
  const [state, dispatch] = useFormState(editCategory, null);
  return (
    <div>
      <form action={dispatch}>
        <Input
          name="category_name"
          type="text"
          placeholder="카테고리 이름"
          required={true}
          defaultValue={category.category_name}
          errors={state?.fieldErrors?.category_name}
        />
        <Button text="카테고리 수정" />
        <input name="category_id" value={category.id} type="hidden" />
      </form>
    </div>
  );
}
