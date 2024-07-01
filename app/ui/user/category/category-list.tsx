"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteUserCategory from "@/app/ui/user/category/buttons";
import { UserCategory, UserCategoryProps } from "@/app/lib/defenitions";

export default function CategoryList({ category }: UserCategoryProps) {
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<number>(0);
  const [categoryList, setCategoryList] = useState<UserCategory[]>([]);

  useEffect(() => {
    if (selectedCategoryCode !== null) {
      const categoryList = category.filter(
        (cat) =>
          cat.category_code === selectedCategoryCode && cat.is_active === true
      );
      setCategoryList(categoryList);
    }
  }, [selectedCategoryCode, category]);

  const handleCategoryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategoryCode(Number(e.target.value));
  };

  const renderCategories = () => {
    if (selectedCategoryCode !== 0) {
      return (
        <div className="border-y-2 border-black mt-1">
          <ul className="border-b-2 border-black pb-1">
            {categoryList.map((category) => (
              <li
                className="flex justify-between h-12 border-b border-gray-300"
                key={category.id}
              >
                <div className="mx-0 my-auto">
                  <Link
                    className="text-black"
                    href={`/user/category/${category.id}/edit-category/`}
                  >
                    {category.category_name}
                  </Link>
                </div>
                <div className="mx-0 my-auto">
                  <DeleteUserCategory user_category_id={category.id} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    const mainCategories = categoryList.filter((cat) => cat.parent_id === null);
    const subCategories = categoryList.filter((cat) => cat.parent_id !== null);

    return (
      <div>
        <div className="mt-1" />
        <ul className="border-b-2 border-black pb-1">
          {mainCategories.map((mainCategory) => (
            <li className="mt-3 border-black border-t-2" key={mainCategory.id}>
              <div className="flex justify-between h-12 border-b-2 border-gray-300">
                <Link
                  href={`/user/category/${mainCategory.id}/edit-category/`}
                  className="text-black mx-0 my-auto font-bold"
                >
                  {mainCategory.category_name}
                </Link>
                <div className="mx-0 my-auto">
                  <DeleteUserCategory user_category_id={mainCategory.id} />
                </div>
              </div>
              <ul>
                {subCategories
                  .filter(
                    (subCategory) => subCategory.parent_id === mainCategory.id
                  )
                  .map((subCategory) => (
                    <li
                      className="flex justify-between h-12 border-b border-gray-300 last:border-b-0"
                      key={subCategory.id}
                    >
                      <Link
                        href={`/user/category/${subCategory.id}/edit-category/`}
                        className="text-black mx-0 my-auto"
                      >
                        <div className="pl-5">{subCategory.category_name}</div>
                      </Link>
                      <div className="mx-0 my-auto">
                        <DeleteUserCategory user_category_id={subCategory.id} />
                      </div>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="mt-3">
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
      <div className="mt-5">{renderCategories()}</div>
    </div>
  );
}
