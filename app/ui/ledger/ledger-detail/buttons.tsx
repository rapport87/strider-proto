import { deleteLedgerDetail } from "@/app/lib/actions";

export default function DeleteLedgerDetail({
  ledgerId,
  ledgerDetailId,
}: {
  ledgerId: string;
  ledgerDetailId: string;
}) {
  const deleteLedgerDetailWithId = deleteLedgerDetail.bind(
    null,
    ledgerId,
    ledgerDetailId
  );
  return (
    <form action={deleteLedgerDetailWithId}>
      <button className="rounded-md border p-2 bg-red-500 text-white hover:bg-red-700">
        내역 삭제
      </button>
    </form>
  );
}
