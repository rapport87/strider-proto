import {
  getCategoryGroup,
  getUserCategory,
  getUserCategoryByIdGroupRel,
} from "@/app/lib/data";
import CategoryGroupRelList from "@/app/ui/user/category/category-group-rel/category-group-rel-list";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/solid";

export default async function Page() {
  const userCategory = await getUserCategory();
  const userCategoryGroup = await getCategoryGroup();
  const userCategoryGroupRel = await getUserCategoryByIdGroupRel();
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <UserIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">
          카테고리 그룹 설정
        </h1>
      </div>
      <CategoryGroupRelList
        category={userCategory}
        category_group={userCategoryGroup}
        category_group_rel={userCategoryGroupRel}
      />
      <div className="mt-2 text-right">
        <Link href="/user/category/category-group/create-category-group">
          <button className="rounded-md border px-3 py-2 hover:bg-gray-100 text-black">
            카테고리 그룹 추가
          </button>
        </Link>
      </div>
    </div>
  );
}
