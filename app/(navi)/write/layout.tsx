import WriteNavigation from "@/app/ui/ledger/write/write_navigation";

export default function WriteNaviLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>
) {
  
  return (
    <div>
        <WriteNavigation/>
        {children}
    </div>
  );
}
