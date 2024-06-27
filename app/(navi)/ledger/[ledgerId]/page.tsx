import { getLedgerDetailsByLedgerId, getLedgerById } from "@/app/lib/data";
import LedgerDetailList from "@/app/ui/ledger/ledger-detail/ledger-detail-list";
import Link from "next/link";
import { WalletIcon } from "@heroicons/react/24/solid";

export default async function Page({
  params,
}: {
  params: { ledgerId: string };
}) {
  const ledgerDetails = await getLedgerDetailsByLedgerId(params.ledgerId);
  const ledger = await getLedgerById(params.ledgerId);

  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <WalletIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">
          {ledger?.user_ledger[0].ledger_name} 내역
        </h1>
      </div>
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
      <div className="text-right mt-5">
        <span className="rounded-md border p-2 text-black hover:bg-gray-100">
          <Link
            className="text-black "
            href={`/ledger/${params.ledgerId}/ledgerDetail/write/`}
          >
            가계부 작성
          </Link>
        </span>
      </div>
    </div>
  );
}
