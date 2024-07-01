import {
  ExpelUserFromLedger,
  TransferLedgerOwner,
} from "@/app/ui/ledger/buttons";
import { MemberListProps } from "@/app/lib/defenitions";

export default async function MemberList({
  user_id,
  ledger_id,
  user_ledger,
}: MemberListProps) {
  const isOwner = user_ledger.some(
    (user) => user.user_id === user_id && user.is_owner
  );
  return (
    <div className="mt-5">
      <div>
        <h2 className="ml-1 font-extrabold text-lg">가계부 이용자</h2>
      </div>
      <ul className="mt-3 border-y border-black border-b-2">
        {user_ledger.map((user) => (
          <li
            className="flex justify-between h-12 py-1 border-b border-gray-300 last:border-b-0"
            key={user.user_id}
          >
            <div className="mx-0 my-auto">{user.user_name}</div>

            {isOwner && user_id !== user.user_id ? (
              <div className="flex">
                <span className="px-1">
                  <ExpelUserFromLedger
                    ledger_id={ledger_id}
                    user_id={user.user_id}
                  />
                </span>
                <span className="px-1">
                  <TransferLedgerOwner
                    ledger_id={ledger_id}
                    user_id={user.user_id}
                  />
                </span>
              </div>
            ) : (
              ""
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
