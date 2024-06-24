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
    <div>
      <div className="mt-5">
        <h2>가계부 사용자</h2>
      </div>
      {user_ledger.map((user) => (
        <div className="flex" key={user.user_id}>
          <span>{user.user_name}</span>

          {isOwner && user_id !== user.user_id ? (
            <>
              <span>
                <ExpelUserFromLedger
                  ledger_id={ledger_id}
                  user_id={user.user_id}
                />
              </span>
              <span>
                <TransferLedgerOwner
                  ledger_id={ledger_id}
                  user_id={user.user_id}
                />
              </span>
            </>
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
}
