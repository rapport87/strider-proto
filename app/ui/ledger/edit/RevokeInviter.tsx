import { revokeInviter } from "@/app/lib/actions";

export function RevokeInviter({
  ledger_id,
  user_id,
}: {
  ledger_id: string;
  user_id: string;
}) {
  const revokeInviterWithId = revokeInviter.bind(null, ledger_id, user_id);
  return (
    <form action={revokeInviterWithId}>
      <button className="rounded-md border p-2 bg-red-500 text-white hover:bg-red-700">
        추방
      </button>
    </form>
  );
}
