"use client";

import {
  createUserCategoryGroupRel,
  deleteUserCategoryGroupRel,
} from "@/app/lib/actions";
import {
  UserCategory,
  CreateCategoryGroupRelProps,
} from "@/app/lib/defenitions";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoryGroupRelList({
  category,
  category_group,
  category_group_rel,
}: CreateCategoryGroupRelProps) {
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<number>(0);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    category_group[0].id
  );
  const [categoryList, setCategoryList] = useState<UserCategory[]>([]);
  const [checkedCategories, setCheckedCategories] = useState<{
    [key: string]: boolean;
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
        (acc: { [key: string]: boolean }, rel) => {
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
    setSelectedGroupId(e.target.value);
  };

  const handleCheckboxChange = (categoryId: string) => {
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
      return (
        <div className="border-y-2 border-black mt-1">
          <ul className="border-black pb-1">
            {categoryList.map((category) => (
              <li
                className="flex justify-between h-12 border-b border-gray-300 last:border-b-0"
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
                  <div className="flex items-center">
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
                <div className="mx-0 my-auto">
                  <Link
                    href={`/user/category/${mainCategory.id}/edit-category/`}
                    className="text-black font-bold"
                  >
                    {mainCategory.category_name}
                  </Link>
                </div>
                <div className="mx-0 my-auto">
                  <div className="flex items-center">
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
                      <div className="mx-0 my-auto">
                        <Link
                          href={`/user/category/${subCategory.id}/edit-category/`}
                          className="text-black"
                        >
                          <div className="pl-5">
                            {subCategory.category_name}
                          </div>
                        </Link>
                      </div>
                      <div className="mx-0 my-auto">
                        <div className="flex items-center">
                          <label className="relative flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={!!checkedCategories[subCategory.id]}
                              onChange={() =>
                                handleCheckboxChange(subCategory.id)
                              }
                            />
                            <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700"></div>
                          </label>
                        </div>
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
    <div className="mt-5">
      <div>
        <label
          htmlFor="assetCategoryId"
          className="block mb-1 text-sm font-medium text-gray-900"
        >
          카테고리
        </label>
        <select
          className="w-block w-full h-10 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500"
          id="user_category_group_id"
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
      <ul className="w-full flex mt-3">
        <li className="mr-2">
          <input
            type="radio"
            id="asset"
            name="category_code"
            className="hidden peer"
            value="0"
            onChange={handleCategoryCodeChange}
            defaultChecked
          />
          <label
            htmlFor="asset"
            className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
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
            name="category_code"
            className="hidden peer"
            value="1"
            onChange={handleCategoryCodeChange}
          />
          <label
            htmlFor="income"
            className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
          >
            <div className="block">
              <div className="w-full">수입</div>
            </div>
          </label>
        </li>
        <li>
          <input
            type="radio"
            id="expend"
            name="category_code"
            className="hidden peer"
            value="2"
            onChange={handleCategoryCodeChange}
          />
          <label
            htmlFor="expend"
            className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
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
