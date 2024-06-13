import { getInvitedLedgerList, getLedgers } from "@/app/lib/data";
import InvitedLedgerList from "@/app/ui/ledger/invited-ledger-list";
import LedgerList from "@/app/ui/ledger/ledger-list";
import Link from "next/link";

export default async function Page() {
  const ledgerList = await getLedgers();
  const inviteList = await getInvitedLedgerList();
  return (
    <div>
      {ledgerList.map((ledgerList) => (
        <LedgerList key={ledgerList.ledger_id} {...ledgerList} />
      ))}
      <div className="text-right">
        <Link className="text-black" href={`/ledger/create-ledger`}>
          가계부 생성
        </Link>
      </div>
      {inviteList.length > 0 ? <div className="mt-5">초대받은 가계부</div> : ""}
      {inviteList.length > 0
        ? inviteList.map((inviteList) => (
            <InvitedLedgerList key={inviteList.id} {...inviteList} />
          ))
        : ""}
    </div>
  );
}
