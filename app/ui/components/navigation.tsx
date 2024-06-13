import NavigationUI from "./NavigationUI";
import { getLedgers } from "@/app/lib/data";

export default async function Navigation() {
  const ledgers = await getLedgers();
  const defaultLedger = ledgers.filter((ledger) => ledger.is_default);

  return <NavigationUI default_ledger_id={defaultLedger[0].ledger_id} />;
}
