import { deleteLedgerDetail } from "@/app/lib/actions";

export default function DeleteLedgerDetail({
  ledger_id,
  ledger_detail_id,
}: {
  ledger_id: string;
  ledger_detail_id: string;
}) {
  const deleteLedgerDetailWithId = deleteLedgerDetail.bind(
    null,
    ledger_id,
    ledger_detail_id
  );
  return (
    <form action={deleteLedgerDetailWithId}>
      <button className="rounded-md border p-2 bg-red-500 text-white hover:bg-red-700">
        내역 삭제
      </button>
    </form>
  );
}
