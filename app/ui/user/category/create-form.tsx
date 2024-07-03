"use client";

import { createCategory } from "@/app/lib/actions";
import Button from "@/app/ui/components/button";
import Input from "@/app/ui/components/input";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { UserCategory, UserCategoryProps } from "@/app/lib/defenitions";

export default function CreateCategoryForm({ category }: UserCategoryProps) {
  const [state, dispatch] = useFormState(createCategory, null);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<number>(0);
  const [selectedParentExists, setSelectedParentExists] = useState<number>(0);
  const [assetCategory, setAssetCategory] = useState<UserCategory[]>([]);

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
    <div className="mt-5">
      <form action={dispatch}>
        <ul className="w-full flex">
          <li className="mr-2">
            <input
              type="radio"
              id="asset"
              name="categoryCode"
              className="hidden peer"
              value="0"
              onChange={handleCategoryCodeChange}
              defaultChecked
            />
            <label
              htmlFor="asset"
              className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 "
            >
              <div className="block">
                <div className="w-full">자산</div>
              </div>
            </label>
          </li>
          <li className="mr-2">
            <input
              type="radio"
              id="income"
              name="categoryCode"
              className="hidden peer"
              value="1"
              onChange={handleCategoryCodeChange}
            />
            <label
              htmlFor="income"
              className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 "
            >
              <div className="block">
                <div className="w-full">수입</div>
              </div>
            </label>
          </li>
          <li className="mr-2">
            <input
              type="radio"
              id="expend"
              name="categoryCode"
              className="hidden peer"
              value="2"
              onChange={handleCategoryCodeChange}
            />
            <label
              htmlFor="expend"
              className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 "
            >
              <div className="block">
                <div className="w-full">지출</div>
              </div>
            </label>
          </li>
        </ul>
        {selectedCategoryCode === 0 ? (
          <div className="mt-3">
            <ul className="w-full flex">
              <li className="mr-2">
                <input
                  type="radio"
                  id="assetGroup"
                  name="parentExists"
                  className="hidden peer"
                  value="0"
                  onChange={handleParentExistsChange}
                  defaultChecked
                />
                <label
                  htmlFor="assetGroup"
                  className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-green-600 peer-checked:text-green-600 hover:text-green-600 hover:bg-gray-100 "
                >
                  <div className="block">
                    <div className="w-full">자산 그룹</div>
                  </div>
                </label>
              </li>
              <li>
                <input
                  type="radio"
                  id="assetSub"
                  name="parentExists"
                  className="hidden peer"
                  value="1"
                  onChange={handleParentExistsChange}
                />
                <label
                  htmlFor="assetSub"
                  className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-green-600 peer-checked:text-green-600 hover:text-gray-600 hover:bg-gray-100 "
                >
                  <div className="block">
                    <div className="w-full">자산 세분류</div>
                  </div>
                </label>
              </li>
            </ul>
            {selectedCategoryCode === 0 && selectedParentExists === 1 ? (
              <div className="mt-3">
                <label
                  htmlFor="parentId"
                  className="block mb-1 text-sm font-medium text-gray-900"
                >
                  거래 분류
                </label>
                <select
                  className="w-block w-full h-10 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  id="parentId"
                  name="parentId"
                  required
                >
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
        <div className="mt-3">
          <label
            htmlFor="title"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            카테고리 이름
          </label>
          <Input
            name="categoryName"
            type="text"
            placeholder="카테고리 이름"
            required={true}
            errors={state?.fieldErrors.categoryName}
          />
        </div>
        <div className="mt-3">
          <Button text="카테고리 생성" />
        </div>
      </form>
    </div>
  );
}
