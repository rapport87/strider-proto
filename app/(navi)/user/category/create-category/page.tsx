import CreateCategoryForm from "@/app/ui/user/category/create-form";
import { getUserCategory } from "@/app/lib/actions";

export default async function CreateCategory() {
  const userCategory = await getUserCategory();
  return <CreateCategoryForm category={userCategory} />;
}
