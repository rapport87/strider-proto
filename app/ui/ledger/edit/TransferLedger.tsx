import { transferLedger } from "@/app/lib/actions";

export function TransferLedger({ ledger_id, user_id }: { ledger_id: number, user_id : number }) {
    const transferLedgerWithId = transferLedger.bind(null, ledger_id, user_id)
    return (
      <form action={transferLedgerWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          양도
        </button>
      </form>
    );
  }