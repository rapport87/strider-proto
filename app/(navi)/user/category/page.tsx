import { getUserCategory } from "@/app/lib/data";
import CategoryList from "@/app/ui/user/category/category-list";
import Link from "next/link";

export default async function Page() {
  const userCategory = await getUserCategory();
  return (
    <div>
      <div>UserCategory</div>
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
