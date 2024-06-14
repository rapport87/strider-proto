import CreateCategoryForm from "@/app/ui/user/category/create-form";
import { getUserCategoryById } from "@/app/lib/data";

export default async function Page() {
  const userCategory = await getUserCategoryById();
  return <CreateCategoryForm category={userCategory} />;
}
