import LedgerDetailForm from "@/app/ui/ledger/ledger-detail/ledger-detail-form";
import { getLedgerDetailById, getUserCategory } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { PencilIcon } from "@heroicons/react/24/solid";

export default async function Page({
  params,
}: {
  params: { ledgerDetailId: string };
}) {
  const [userCategory, ledgerDetail] = await Promise.all([
    getUserCategory(),
    getLedgerDetailById(params.ledgerDetailId),
  ]);
  if (!ledgerDetail) {
    notFound();
  }
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <PencilIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-5">편집</h1>
      </div>
      <LedgerDetailForm
        category={userCategory}
        ledgerDetail={ledgerDetail}
        isEdit={true}
      />
    </div>
  );
}
