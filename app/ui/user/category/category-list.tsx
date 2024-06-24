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
      return categoryList.map((category) => (
        <div className="flex justify-between" key={category.id}>
          <div>
            <Link
              className="text-black"
              href={`/user/category/${category.id}/edit-category/`}
            >
              {category.category_name}
            </Link>
          </div>
          <div>
            <DeleteUserCategory user_category_id={category.id} />
          </div>
        </div>
      ));
    }

    const mainCategories = categoryList.filter((cat) => cat.parent_id === null);
    const subCategories = categoryList.filter((cat) => cat.parent_id !== null);

    return mainCategories.map((mainCategory) => (
      <div key={mainCategory.id}>
        <div className="flex justify-between">
          <div>
            <Link
              href={`/user/category/${mainCategory.id}/edit-category/`}
              className="text-black"
            >
              {mainCategory.category_name}
            </Link>
          </div>
          <div>
            <DeleteUserCategory user_category_id={mainCategory.id} />
          </div>
        </div>
        {subCategories
          .filter((subCategory) => subCategory.parent_id === mainCategory.id)
          .map((subCategory) => (
            <div className="flex justify-between" key={subCategory.id}>
              <div>
                <Link
                  href={`/user/category/${subCategory.id}/edit-category/`}
                  className="text-black"
                >
                  <div className="pl-5">{subCategory.category_name}</div>
                </Link>
              </div>
              <div>
                <DeleteUserCategory user_category_id={subCategory.id} />
              </div>
            </div>
          ))}
      </div>
    ));
  };

  return (
    <div>
      <div>
        <input
          type="radio"
          name="categoryCode"
          value="0"
          onChange={handleCategoryCodeChange}
          defaultChecked
        />{" "}
        자산
        <input
          type="radio"
          name="categoryCode"
          value="1"
          onChange={handleCategoryCodeChange}
        />{" "}
        수입
        <input
          type="radio"
          name="categoryCode"
          value="2"
          onChange={handleCategoryCodeChange}
        />{" "}
        지출
      </div>
      {renderCategories()}
    </div>
  );
}
