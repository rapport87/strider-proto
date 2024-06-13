import {
  getCategoryGroup,
  getUserCategory,
  getUserCategoryGroupRel,
} from "@/app/lib/data";
import CategoryGroupRelList from "@/app/ui/user/category/category-group-rel/category-group-rel-list";
import Link from "next/link";

export default async function Page() {
  const userCategory = await getUserCategory();
  const userCategoryGroup = await getCategoryGroup();
  const userCategoryGroupRel = await getUserCategoryGroupRel();
  return (
    <div>
      <div>카테고리 그룹</div>
      <CategoryGroupRelList
        category={userCategory}
        category_group={userCategoryGroup}
        category_group_rel={userCategoryGroupRel}
      />
      <div className="mt-2">
        <Link href="/user/category/category-group/create-category-group">
          <button className="primary-btn p-2 text-black disabled:bg-neutral-400 disabled:text-neutral-300">
            카테고리 그룹 추가
          </button>
        </Link>
      </div>
    </div>
  );
}
