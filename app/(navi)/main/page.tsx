import { getUserLedgers, getLedgerDetailsByLedgerId } from "@/app/lib/data";
import getSession from "@/app/lib/session";
import LedgerDetailList from "@/app/ui/ledger/ledger-detail/ledger-detail-list";
import { HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

async function getIsOwner(userId: string) {
  const session = await getSession();
  if (session.id) {
    return (session.id = userId);
  }
  return false;
}

export default async function Page() {
  const defaultLedger = (await getUserLedgers()).filter(
    (ledger) => ledger.is_default === true
  );
  const ledgerDetails = await getLedgerDetailsByLedgerId(
    defaultLedger[0].ledger_id
  );

  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <HomeIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">
          {defaultLedger[0].ledger_name}
          <span className="text-gray-500 text-sm font-normal">(기본)</span>
        </h1>
      </div>
      <div className="mt-5">
        {ledgerDetails.map((ledgerDetail) => (
          <Link
            key={ledgerDetail.id}
            href={`/ledger/${defaultLedger[0].ledger_id}/ledgerDetail/${ledgerDetail.id}/edit`}
          >
            <LedgerDetailList {...ledgerDetail} />
          </Link>
        ))}
      </div>
      <div className="text-right mt-5">
        <Link href={`/ledger/${defaultLedger[0].ledger_id}/ledgerDetail/write`}>
          <span className="rounded-md border px-3 py-2 hover:bg-gray-100 text-black">
            가계부 작성
          </span>
        </Link>
      </div>
    </div>
  );
}
