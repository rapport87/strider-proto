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
import NavigationUI from "./NavigationUI";
import { getLedgers } from "@/app/lib/actions";

export default async function Navigation() {
  const ledgers = await getLedgers();
  const defaultLedger = ledgers.filter(ledger => ledger.is_default);
  
  return <NavigationUI default_ledger_id={defaultLedger[0].ledger_id} />;
}