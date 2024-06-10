"use client";

import {
  HomeIcon as SolidHomeIcon,
  PencilIcon as SolidPencilIcon,
  WalletIcon as SolidWalletIconIcon,
  UserIcon as SolidUserIcon,
} from "@heroicons/react/24/solid";
import {
  HomeIcon as OutlineHomeIcon,
  PencilIcon as OutlinePencilIcon,
  WalletIcon as OutlineWalletIcon,
  UserIcon as OutlineUserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationUIProps {
  default_ledger_id: string;
}

export default function NavigationUI({ default_ledger_id }: NavigationUIProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full mx-auto max-w-screen-sm grid grid-cols-4 border-neutral-600 border-t px-5 py-3 *:text-white bg-green-600/90">
      <Link href="/main" className="flex flex-col items-center gap-px">
        {pathname === "/main" ? (
          <SolidHomeIcon className="w-7 h-7" />
        ) : (
          <OutlineHomeIcon className="w-7 h-7" />
        )}
        <span>홈</span>
      </Link>
      <Link
        href={`/ledger/${default_ledger_id}/ledgerDetail/write`}
        className="flex flex-col items-center gap-px"
      >
        {pathname.startsWith(
          `/ledger/${default_ledger_id}/ledgerDetail/write`
        ) ? (
          <SolidPencilIcon className="w-7 h-7" />
        ) : (
          <OutlinePencilIcon className="w-7 h-7" />
        )}
        <span>작성</span>
      </Link>
      <Link href="/ledger" className="flex flex-col items-center gap-px">
        {pathname === "/ledger" ? (
          <SolidWalletIconIcon className="w-7 h-7" />
        ) : (
          <OutlineWalletIcon className="w-7 h-7" />
        )}
        <span>가계부</span>
      </Link>
      <Link href="/user" className="flex flex-col items-center gap-px">
        {pathname === "/user" ? (
          <SolidUserIcon className="w-7 h-7" />
        ) : (
          <OutlineUserIcon className="w-7 h-7" />
        )}
        <span>사용자</span>
      </Link>
    </div>
  );
}
