import { getUserLedgers, getLedgerDetailsByLedgerId } from "@/app/lib/data";
import getSession from "@/app/lib/session";
import LedgerDetailList from "@/app/ui/ledger/ledger-detail/ledger-detail-list";
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
    <div>
      <div>
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
          <span className="rounded-md border p-2 text-black hover:bg-gray-100 text-right">
            가계부 작성
          </span>
        </Link>
      </div>
    </div>
  );
}
