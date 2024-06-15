import LedgerDetailForm from "@/app/ui/ledger/ledger-detail/ledger-detail-form";
import { getLedgerDetailById, getUserCategory } from "@/app/lib/data";
import { notFound } from "next/navigation";

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
    <LedgerDetailForm
      category={userCategory}
      ledgerDetail={ledgerDetail}
      isEdit={true}
    />
  );
}
