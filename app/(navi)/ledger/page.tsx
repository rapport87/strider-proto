import { existsInvite, getLedgers } from "@/app/lib/actions";
import getSession from "@/app/lib/session";
import InviteListLedger from "@/app/ui/components/invite_ledger_list";
import ListLedger from "@/app/ui/components/ledger_list";
import Link from "next/link";

export default async function ledger() {
  const ledgerList = await getLedgers();
  const inviteList = await existsInvite();
  return (
    <div>
      {ledgerList.map((ledgerList) => (
        <ListLedger key={ledgerList.ledger_id} {...ledgerList} />
      ))}
      <div className="text-right">
        <Link className="text-black" href={`/ledger/create-ledger`}>
          가계부 생성
        </Link>
      </div>
      {inviteList.length > 0 ? <div className="mt-5">초대받은 가계부</div> : ""}
      {inviteList.length > 0
        ? inviteList.map((inviteList) => (
            <InviteListLedger key={inviteList.id} {...inviteList} />
          ))
        : ""}
    </div>
  );
}
