"use client";

import { createCategory } from "@/app/lib/actions";
import Button from "@/app/ui/components/button";
import Input from "@/app/ui/components/input";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { Category, WriteProps } from "@/app/lib/defenitions";

export default function CreateCategoryForm({ category }: WriteProps) {
  const [state, dispatch] = useFormState(createCategory, null);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<number>(0);
  const [selectedParentExists, setSelectedParentExists] = useState<number>(0);
  const [assetCategory, setAssetCategory] = useState<Category[]>([]);

  useEffect(() => {
    if (selectedCategoryCode !== null) {
      const assetCategory = category.filter(
        (cat) =>
          cat.category_code === 0 &&
          cat.parent_id === null &&
          cat.is_active === true
      );
      setAssetCategory(assetCategory);
    }
  }, [selectedCategoryCode, category]);

  const handleCategoryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategoryCode(Number(e.target.value));

    if (Number(e.target.value) === 0) {
      setSelectedParentExists(0);
    }
  };

  const handleParentExistsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedParentExists(Number(e.target.value));
  };

  return (
    <div>
      <form action={dispatch}>
        <div>
          <input
            type="radio"
            name="category_code"
            value="0"
            onChange={handleCategoryCodeChange}
            defaultChecked
          />{" "}
          자산
          <input
            type="radio"
            name="category_code"
            value="1"
            onChange={handleCategoryCodeChange}
          />{" "}
          수입
          <input
            type="radio"
            name="category_code"
            value="2"
            onChange={handleCategoryCodeChange}
          />{" "}
          지출
        </div>
        {selectedCategoryCode === 0 ? (
          <div>
            <div>
              <input
                type="radio"
                value="0"
                onChange={handleParentExistsChange}
                name="parent_exists"
                defaultChecked
              />{" "}
              자산 그룹
              <input
                type="radio"
                value="1"
                onChange={handleParentExistsChange}
                name="parent_exists"
              />{" "}
              자산 세분류
            </div>
            {selectedCategoryCode === 0 && selectedParentExists === 1 ? (
              <div>
                <select className="w-full h-10" name="parent_id" required>
                  {assetCategory.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        <Input
          name="category_name"
          type="text"
          placeholder="카테고리 이름"
          required={true}
          errors={state?.fieldErrors.category_name}
        />
        <Button text="카테고리 생성" />
      </form>
    </div>
  );
}
