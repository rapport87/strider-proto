import EditLedgerDetailForm from "@/app/ui/ledger/ledger-detail/edit-form";
import { getLedgerDetailById, getUserCategoryById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { ledgerDetailId: string };
}) {
  const [userCategory, ledgerDetail] = await Promise.all([
    getUserCategoryById(),
    getLedgerDetailById(params.ledgerDetailId),
  ]);
  if (!ledgerDetail) {
    notFound();
  }
  return (
    <EditLedgerDetailForm category={userCategory} ledgerDetail={ledgerDetail} />
  );
}
