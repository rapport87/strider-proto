import {
  deleteLedger,
  setDefaultLedger,
  transferLedgerOwner,
  expelUserFromLedger,
  createInviteResponse,
} from "@/app/lib/actions";

export function DeleteLedger({ ledger_id }: { ledger_id: string }) {
  const deleteLedgerWithId = deleteLedger.bind(null, ledger_id);
  return (
    <form action={deleteLedgerWithId}>
      <button className="rounded-md border px-3 py-2 bg-red-500 text-white hover:bg-red-700">
        가계부 삭제
      </button>
    </form>
  );
}

export function SetDefaultLedger({ ledger_id }: { ledger_id: string }) {
  const setDefaultLedgerWithId = setDefaultLedger.bind(null, ledger_id);
  return (
    <form action={setDefaultLedgerWithId}>
      <button className="rounded-md border px-3 py-2 hover:bg-gray-100">
        기본 가계부로 설정
      </button>
    </form>
  );
}

export function TransferLedgerOwner({
  ledger_id,
  user_id,
}: {
  ledger_id: string;
  user_id: string;
}) {
  const transferLedgerOwnerWithId = transferLedgerOwner.bind(
    null,
    ledger_id,
    user_id
  );
  return (
    <form action={transferLedgerOwnerWithId}>
      <button className="rounded-md border px-3 py-2 hover:bg-gray-100">
        양도
      </button>
    </form>
  );
}

export function ExpelUserFromLedger({
  ledger_id,
  user_id,
}: {
  ledger_id: string;
  user_id: string;
}) {
  const expelUserFromLedgerWithId = expelUserFromLedger.bind(
    null,
    ledger_id,
    user_id
  );
  return (
    <form action={expelUserFromLedgerWithId}>
      <button className="rounded-md border px-3 py-2 bg-red-500 text-white hover:bg-red-700">
        추방
      </button>
    </form>
  );
}

export function AgreeInviteButton({ ledger_id }: { ledger_id: string }) {
  const agreeAction = createInviteResponse.bind(null, ledger_id, 1);
  return (
    <form action={agreeAction}>
      <button className="rounded-md border px-3 py-2 bg-green-500 hover:bg-green-700 text-white">
        수락
      </button>
    </form>
  );
}

export function RefuseInviteButton({ ledger_id }: { ledger_id: string }) {
  const refuseAction = createInviteResponse.bind(null, ledger_id, 2);
  return (
    <form action={refuseAction}>
      <button className="rounded-md border px-3 py-2 bg-red-500 hover:bg-red-700 text-white">
        거절
      </button>
    </form>
  );
}

export function IgnoreInviteButton({ ledger_id }: { ledger_id: string }) {
  const ignoreAction = createInviteResponse.bind(null, ledger_id, 3);
  return (
    <form action={ignoreAction}>
      <button className="rounded-md border px-3 py-2 hover:bg-gray-100">
        무시
      </button>
    </form>
  );
}
