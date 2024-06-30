import { getUserCategory } from "@/app/lib/data";
import CategoryList from "@/app/ui/user/category/category-list";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/solid";

export default async function Page() {
  const userCategory = await getUserCategory();
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <UserIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">카테고리 설정</h1>
      </div>

      <CategoryList category={userCategory} />
      <div className="flex justify-between mt-5">
        <span className="rounded-md border p-2 text-black hover:bg-gray-100">
          <Link className="text-black " href={`/user/category/category-group`}>
            카테고리 그룹 관리
          </Link>
        </span>
        <span className="rounded-md border p-2 text-black hover:bg-gray-100">
          <Link className="text-black " href={`/user/category/create-category`}>
            카테고리 생성
          </Link>
        </span>
      </div>
    </div>
  );
}
