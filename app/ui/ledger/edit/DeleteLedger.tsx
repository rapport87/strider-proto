import { deleteLedger } from "@/app/lib/actions";

export function DeleteLedger({ ledger_id }: { ledger_id: string }) {
  const deleteLedgerWithId = deleteLedger.bind(null, ledger_id);
  return (
    <form action={deleteLedgerWithId}>
      <button className="rounded-md border p-2 bg-red-500 text-white hover:bg-red-700">
        가계부 삭제
      </button>
    </form>
  );
}
