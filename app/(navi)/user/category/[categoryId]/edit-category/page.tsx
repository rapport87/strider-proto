import EditCategoryForm from "@/app/ui/user/category/edit-form";
import { getUserCategoryById } from "@/app/lib/data";
import { UserIcon } from "@heroicons/react/24/solid";

export default async function Page({
  params,
}: {
  params: { categoryId: string };
}) {
  const userCategory = await getUserCategoryById(params.categoryId);
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <UserIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">카테고리 수정</h1>
      </div>
      <EditCategoryForm category={userCategory} />
    </div>
  );
} //EditCategoryForm : user_id 다건 조회와 pk 단건 조회 결과가 동일하게 list로 반환됨. 해당건은 단건조회로 값이 1개 이상 존재하지 않음
