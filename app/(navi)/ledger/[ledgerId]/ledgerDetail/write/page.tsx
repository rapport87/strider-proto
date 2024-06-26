import LedgerDetailForm from "@/app/ui/ledger/ledger-detail/ledger-detail-form";
import { getUserCategoryByIdByLedgerId } from "@/app/lib/data";
import { PencilIcon } from "@heroicons/react/24/solid";

export default async function Page({
  params,
}: {
  params: { ledgerId: string };
}) {
  const userCategory = await getUserCategoryByIdByLedgerId(params.ledgerId);
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <PencilIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-5">작성</h1>
      </div>
      <LedgerDetailForm category={userCategory} />
    </div>
  );
}
