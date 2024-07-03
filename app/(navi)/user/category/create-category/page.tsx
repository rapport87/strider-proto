import CreateCategoryForm from "@/app/ui/user/category/create-form";
import { getUserCategory } from "@/app/lib/data";
import { UserIcon } from "@heroicons/react/24/solid";
export default async function Page() {
  const userCategory = await getUserCategory();
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <UserIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">카테고리 생성</h1>
      </div>
      <CreateCategoryForm category={userCategory} />
    </div>
  );
}
