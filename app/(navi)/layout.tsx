import Navigation from "@/app/ui/components/navigation";
import { getLedgers } from "@/app/lib/data";

export default async function NaviLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ledgers = await getLedgers();
  const defaultLedger = ledgers.filter((ledger) => ledger.is_default);
  return (
    <div>
      {children}
      <Navigation default_ledger_id={defaultLedger[0].ledger_id} />
    </div>
  );
}
