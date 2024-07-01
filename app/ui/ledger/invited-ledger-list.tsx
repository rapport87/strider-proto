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
    <li className="flex justify-between h-12 py-1 border-b border-gray-300 last:border-b-0">
      <div className="mx-0 my-auto">{ledger_name}</div>
      <div className="flex">
        <span className="px-1">
          <AgreeInviteButton ledger_id={ledger_id} />
        </span>
        <span className="px-1">
          <RefuseInviteButton ledger_id={ledger_id} />
        </span>
        <span className="px-1">
          <IgnoreInviteButton ledger_id={ledger_id} />
        </span>
      </div>
    </li>
  );
}
