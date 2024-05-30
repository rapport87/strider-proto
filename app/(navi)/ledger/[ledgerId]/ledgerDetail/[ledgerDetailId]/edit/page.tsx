import EditLedgerDetailForm from "@/app/ui/ledger/write/edit-form";
import { getLedgerDetail, getUserCategory } from "@/app/lib/actions";
import { notFound } from "next/navigation";

export default async function EditLedgerDetail({
  params,
}: {
  params: { ledgerDetailId: number };
}) {
  const [userCategory, ledgerDetail] = await Promise.all([
    getUserCategory(),
    getLedgerDetail(Number(params.ledgerDetailId)),
  ]);
  if (!ledgerDetail) {
    notFound();
  }
  return (
    <EditLedgerDetailForm category={userCategory} ledgerDetail={ledgerDetail} />
  );
}
