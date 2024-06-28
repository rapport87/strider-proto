import Link from "next/link";
import { LedgerDetailListProps } from "@/app/lib/defenitions";
import { formatToWon } from "@/app/lib/utils";

function formatDateTime(date: Date) {
  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("ko-KR", optionsDate)
    .format(date)
    .replace(/\s/g, "");
  const formattedTime = new Intl.DateTimeFormat("ko-KR", optionsTime).format(
    date
  );

  return `${formattedDate} ${formattedTime}`;
}

export default function LedgerDetailList({
  title,
  price,
  evented_at,
  asset_category_name,
  transaction_category_name,
  category_code,
}: LedgerDetailListProps) {
  return (
    <div className="border text-black border-black p-2 mt-2">
      <div className="grid grid-cols-12 items-center text-center">
        <div className="col-span-1">
          {category_code === 1 ? (
            <span className="col-span-1 text-blue-600 text-2xl">+</span>
          ) : (
            <span className="col-span-1 text-red-600 text-2xl">-</span>
          )}
        </div>
        <div className="col-span-2 text-left">
          <span>{transaction_category_name}</span>
        </div>
        <div className="col-span-5 text-left pl-3">
          <div>{title}</div>
          <div className="text-xs">
            <span>{formatDateTime(new Date(evented_at))}</span>
            <span> - {asset_category_name}</span>
          </div>
        </div>
        <div className="col-span-4 text-end pr-3">
          {category_code === 1 ? (
            <span className="text-blue-600">{formatToWon(price)}</span>
          ) : (
            <span className="text-red-600">{formatToWon(price)}</span>
          )}
          원
        </div>
      </div>
    </div>
  );
}
