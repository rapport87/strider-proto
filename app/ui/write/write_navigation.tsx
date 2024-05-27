"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function WriteNavigation() {
  const pathname = usePathname();
  const params = useParams();
  return (
    <div className="w-full mx-auto max-w-screen-sm grid grid-cols-2">
      <Link href={`/ledger/${params.id}/write/income`}>
        {pathname === `/ledger/${params.id}/write/income` ? (
            <div className="bg-green-600/90 text-white flex flex-col items-center py-3">수입</div> ) : (
            <div className="bg-green-300 text-black flex flex-col items-center py-3">수입</div> 
        )}
      </Link>
      <Link href={`/ledger/${params.id}/write/depend`}>
        {pathname === `/ledger/${params.id}/write/depend` ? (
            <div className="bg-green-600/90 text-white flex flex-col items-center py-3">지출</div> ) : (
            <div className="bg-green-300 text-black flex flex-col items-center py-3">지출</div> 
        )}
      </Link>
    </div>
  );
}