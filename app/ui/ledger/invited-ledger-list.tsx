import { InvitedLedgerListProps } from "@/app/lib/defenitions";
import {
  AgreeInviteButton,
  IgnoreInviteButton,
  RefuseInviteButton,
} from "@/app/ui/ledger/buttons";

export default function InvitedLedgerList({
  ledger_id,
  ledger_name,
}: InvitedLedgerListProps) {
  return (
    <div>
      <div className="border border-black p-2 mt-2">
        <div className="grid grid-cols-6 items-center text-center">
          <span>{ledger_name}</span>
          <span>
            <AgreeInviteButton ledger_id={ledger_id} />
          </span>
          <span>
            <RefuseInviteButton ledger_id={ledger_id} />
          </span>
          <span>
            <IgnoreInviteButton ledger_id={ledger_id} />
          </span>
        </div>
      </div>
    </div>
  );
}
