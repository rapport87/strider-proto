import EditLedgerDetailForm from "@/app/ui/ledger/ledger-detail/edit-form";
import { getLedgerDetail, getUserCategory } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { ledgerDetailId: string };
}) {
  const [userCategory, ledgerDetail] = await Promise.all([
    getUserCategory(),
    getLedgerDetail(params.ledgerDetailId),
  ]);
  if (!ledgerDetail) {
    notFound();
  }
  return (
    <EditLedgerDetailForm category={userCategory} ledgerDetail={ledgerDetail} />
  );
}
