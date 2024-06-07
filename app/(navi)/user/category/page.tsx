import { getUserCategory } from "@/app/lib/actions";
import CategoryList from "@/app/ui/user/category/categoryList";
import Link from "next/link";

export default async function Category() {
  const userCategory = await getUserCategory();
  return (
    <div>
      <div>Category</div>
      <CategoryList category={userCategory} />
      <div className="flex justify-between mt-1">
        <Link href="/user/category/category-group">
          <button className="primary-btn p-2 text-black disabled:bg-neutral-400 disabled:text-neutral-300">
            카테고리 그룹 관리
          </button>
        </Link>
        <Link href="/user/category/create-category">
          <button className="primary-btn p-2 text-black disabled:bg-neutral-400 disabled:text-neutral-300">
            카테고리 생성
          </button>
        </Link>
      </div>
    </div>
  );
}
