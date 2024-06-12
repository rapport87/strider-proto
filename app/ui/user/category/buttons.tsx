import { deleteCategory } from "@/app/lib/actions";

export default function DeleteUserCategory({
  user_category_id,
}: {
  user_category_id: string;
}) {
  const deleteCategoryWithId = deleteCategory.bind(null, user_category_id);
  return (
    <form action={deleteCategoryWithId}>
      <button className="rounded-md border p-2 bg-red-500 text-white hover:bg-red-700">
        삭제
      </button>
    </form>
  );
}
