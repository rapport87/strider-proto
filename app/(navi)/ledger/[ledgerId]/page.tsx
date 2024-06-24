import { getLedgerDetailsByLedgerId } from "@/app/lib/data";
import LedgerDetailList from "@/app/ui/ledger/ledger-detail/ledger-detail-list";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { ledgerId: string };
}) {
  const ledgerDetails = await getLedgerDetailsByLedgerId(params.ledgerId);

  return (
    <div>
      <div>
        {ledgerDetails.map((ledgerDetail) => (
          <Link
            key={ledgerDetail.id}
            href={`/ledger/${params.ledgerId}/ledgerDetail/${ledgerDetail.id}/edit`}
          >
            <LedgerDetailList {...ledgerDetail} />
          </Link>
        ))}
      </div>

      <div className="text-right">
        <Link
          className="text-black"
          href={`/ledger/${params.ledgerId}/ledgerDetail/write/`}
        >
          가계부 작성
        </Link>
      </div>
    </div>
  );
}
