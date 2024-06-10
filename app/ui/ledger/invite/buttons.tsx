import { inviteRequest } from "@/app/lib/actions";

export function AgreeInviteButton({ ledger_id }: { ledger_id: string }) {
  const agreeAction = inviteRequest.bind(null, ledger_id, 1);
  return (
    <form action={agreeAction}>
      <button className="rounded-md border p-2 hover:bg-gray-100">수락</button>
    </form>
  );
}

export function RefuseInviteButton({ ledger_id }: { ledger_id: string }) {
  const refuseAction = inviteRequest.bind(null, ledger_id, 2);
  return (
    <form action={refuseAction}>
      <button className="rounded-md border p-2 hover:bg-gray-100">거절</button>
    </form>
  );
}

export function IgnoreInviteButton({ ledger_id }: { ledger_id: string }) {
  const ignoreAction = inviteRequest.bind(null, ledger_id, 3);
  return (
    <form action={ignoreAction}>
      <button className="rounded-md border p-2 hover:bg-gray-100">무시</button>
    </form>
  );
}
