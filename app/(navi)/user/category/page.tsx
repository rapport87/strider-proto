import { getUserCategory } from "@/app/lib/actions";
import CategoryList from "@/app/ui/user/category/categoryList";
import Link from "next/link";

export default async function Category() {
  const userCategory = await getUserCategory();
  return (
    <div>
      <div>Category</div>
      <CategoryList category={userCategory} />
      <div>
        <Link href="/user/category/create-category">
          <button className="rounded-md border p-2 text-black hover:bg-gray-100">
            카테고리 생성
          </button>
        </Link>
      </div>
    </div>
  );
}
