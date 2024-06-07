"use client";

import {
  createUserCategoryGroupRel,
  deleteUserCategoryGroupRel,
} from "@/app/lib/actions";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  parent_id: number | null;
  category_code: number;
  category_name: string;
  is_active: boolean;
}

interface CategoryGroup {
  id: number;
  category_group_name: string;
}

interface CategoryGroupRel {
  user_category_group_id: number;
  user_category_id: number;
}

interface WriteProps {
  category: Category[];
  category_group: CategoryGroup[];
  category_group_rel: CategoryGroupRel[];
}

export default function CreateCategoryGroupRel({
  category,
  category_group,
  category_group_rel,
}: WriteProps) {
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<number>(0);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(
    category_group[0].id
  );
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [checkedCategories, setCheckedCategories] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    if (selectedCategoryCode !== null) {
      const filteredCategoryList = category.filter(
        (cat) =>
          cat.category_code === selectedCategoryCode && cat.is_active === true
      );
      setCategoryList(filteredCategoryList);
    }
  }, [selectedCategoryCode, category]);

  useEffect(() => {
    if (selectedGroupId !== null) {
      const checked = category_group_rel.reduce(
        (acc: { [key: number]: boolean }, rel) => {
          if (rel.user_category_group_id === selectedGroupId) {
            acc[rel.user_category_id] = true;
          }
          return acc;
        },
        {}
      );
      setCheckedCategories(checked);
    }
  }, [selectedGroupId, category_group_rel]);

  const handleCategoryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategoryCode(Number(e.target.value));
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGroupId(Number(e.target.value));
  };

  const handleCheckboxChange = (categoryId: number) => {
    const isChecked = !checkedCategories[categoryId];
    setCheckedCategories((prev) => ({
      ...prev,
      [categoryId]: isChecked,
    }));

    if (isChecked) {
      createUserCategoryGroupRel(selectedGroupId!, categoryId);

      const parentCategory = category.find(
        (cat) => cat.id === categoryId
      )?.parent_id;
      if (parentCategory && !checkedCategories[parentCategory]) {
        setCheckedCategories((prev) => ({
          ...prev,
          [parentCategory]: true,
        }));
        createUserCategoryGroupRel(selectedGroupId!, parentCategory);
      }
    } else {
      deleteUserCategoryGroupRel(selectedGroupId!, categoryId);

      const subCategories = category.filter(
        (cat) => cat.parent_id === categoryId
      );
      subCategories.forEach((subCategory) => {
        setCheckedCategories((prev) => ({
          ...prev,
          [subCategory.id]: false,
        }));
        deleteUserCategoryGroupRel(selectedGroupId!, subCategory.id);
      });
    }
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
            <div className="flex items-center mb-5">
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!checkedCategories[category.id]}
                  onChange={() => handleCheckboxChange(category.id)}
                />
                <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700"></div>
              </label>
            </div>
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
            <div className="flex items-center mb-5">
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!checkedCategories[mainCategory.id]}
                  onChange={() => handleCheckboxChange(mainCategory.id)}
                />
                <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700"></div>
              </label>
            </div>
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
                <div className="flex items-center mb-5">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!checkedCategories[subCategory.id]}
                      onChange={() => handleCheckboxChange(subCategory.id)}
                    />
                    <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
      </div>
    ));
  };

  return (
    <div>
      <div>
        <select
          className="w-full h-10"
          name="user_category_group_id"
          required
          onChange={handleGroupChange}
          value={selectedGroupId || ""}
        >
          {category_group.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_group_name}
            </option>
          ))}
        </select>
      </div>
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
      {renderCategories()}
    </div>
  );
}
