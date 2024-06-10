import CreateCategoryForm from "@/app/ui/user/category/create-form";
import { getUserCategory } from "@/app/lib/actions";

export default async function Page() {
  const userCategory = await getUserCategory();
  return <CreateCategoryForm category={userCategory} />;
}
