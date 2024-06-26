import Link from "next/link";
import { LedgerListProps } from "@/app/lib/defenitions";

export default function LedgerList({
  ledger_id,
  ledger_name,
  is_default,
  is_owner,
}: LedgerListProps) {
  return (
    <div>
      <div className="border border-black p-2 mt-2">
        <div className="grid grid-cols-12 items-center text-center">
          <span className="col-span-3 px-1 text-left">{ledger_name}</span>
          <span className="col-span-2 mx-2 rounded-md border p-1 text-black hover:bg-gray-100">
            <Link className="text-black" href={`/ledger/${ledger_id}`}>
              보기
            </Link>
          </span>
          <span className="col-span-2 mx-2 rounded-md border p-1 text-black hover:bg-gray-100">
            <Link className="text-black" href={`/ledger/${ledger_id}/edit`}>
              편집
            </Link>
          </span>

          {is_owner === true ? (
            <span className="col-span-2 mx-2 rounded-md border p-1 text-black hover:bg-gray-100">
              <Link className="text-black" href={`/ledger/${ledger_id}/invite`}>
                초대
              </Link>
            </span>
          ) : (
            <span className="col-span-2" />
          )}

          <span className="col-span-2">
            {is_default === true ? "기본" : ""}
          </span>
          <span className="col-span-1">{is_owner === true ? "" : "🤝"}</span>
        </div>
      </div>
    </div>
  );
}
