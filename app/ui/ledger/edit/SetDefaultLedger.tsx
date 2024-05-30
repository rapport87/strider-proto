import { setDefaultLedger } from "@/app/lib/actions";

export function SetDefaultLedger({ ledger_id }: { ledger_id: number }) {
    const revokeInvite = setDefaultLedger.bind(null, ledger_id)
    return (
      <form action={revokeInvite}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          기본 가계부로 설정
        </button>
      </form>
    );
  }