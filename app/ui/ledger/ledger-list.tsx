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
      <div className="border-2 border-gray-500 p-2 mt-2 rounded-md">
        <div className="grid grid-cols-12 items-center text-center">
          <span className="col-span-3 px-1 text-left">{ledger_name}</span>
          <Link
            className="text-black col-span-2 mx-2 md:mx-4 rounded-md border px-1 py-2 hover:bg-gray-100"
            href={`/ledger/${ledger_id}`}
          >
            <span className="">보기</span>
          </Link>
          <Link
            className="text-black col-span-2 mx-2 md:mx-4 rounded-md border px-1 py-2 hover:bg-gray-100"
            href={`/ledger/${ledger_id}/edit`}
          >
            <span className="">편집</span>
          </Link>

          {is_owner === true ? (
            <Link
              className="text-black col-span-2 mx-2 md:mx-4 rounded-md border px-1 py-2 hover:bg-gray-100"
              href={`/ledger/${ledger_id}/invite`}
            >
              <span>초대</span>
            </Link>
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
