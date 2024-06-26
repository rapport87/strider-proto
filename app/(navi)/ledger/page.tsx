import { getInvitedLedgerList, getUserLedgers } from "@/app/lib/data";
import InvitedLedgerList from "@/app/ui/ledger/invited-ledger-list";
import LedgerList from "@/app/ui/ledger/ledger-list";
import Link from "next/link";
import { WalletIcon } from "@heroicons/react/24/solid";

export default async function Page() {
  const userLedgerList = await getUserLedgers();
  const inviteList = await getInvitedLedgerList();
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <WalletIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">가계부</h1>
      </div>
      {userLedgerList.map((userLedgerList) => (
        <LedgerList key={userLedgerList.ledger_id} {...userLedgerList} />
      ))}
      <div className="text-right mt-5">
        <span className="rounded-md border p-2 text-black hover:bg-gray-100">
          <Link className="text-black " href={`/ledger/create-ledger`}>
            가계부 생성
          </Link>
        </span>
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
