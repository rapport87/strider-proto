import EditCategoryForm from "@/app/ui/user/category/edit-form";
import { getUserCategoryById } from "@/app/lib/data";

export default async function Page({
  params,
}: {
  params: { categoryId: string };
}) {
  const userCategory = await getUserCategoryById(params.categoryId);
  return <EditCategoryForm category={userCategory[0]} />; //user_id 다건 조회와 pk 단건 조회 결과가 동일하게 list로 반환됨. 해당건은 단건조회로 값이 1개 이상 존재하지 않음
}
