import Navigation from "@/app/ui/components/navigation";
import { getDefaultLedger } from "@/app/lib/data";

export default async function NaviLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ledger = await getDefaultLedger();
  return (
    <div>
      <div className="pb-28">{children}</div>
      <Navigation ledger_id={ledger[0].ledger_id} />
    </div>
  );
}
