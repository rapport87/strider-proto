import { getLedgerDetails } from "@/app/lib/actions";
import ListLedgerDetail from "@/app/ui/components/ledger_detail_list";
import Link from "next/link";

export default async function ViewLedger({
  params,
}: {
  params: { ledgerId: number };
}) {
  const ledgerDetails = await getLedgerDetails(params.ledgerId);

  return (
    <div>
      <div>
        {ledgerDetails.map((ledgerDetail) => (
          <Link
            key={ledgerDetail.id}
            href={`/ledger/${params.ledgerId}/ledgerDetail/${ledgerDetail.id}/edit`}
          >
            <ListLedgerDetail {...ledgerDetail} />
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