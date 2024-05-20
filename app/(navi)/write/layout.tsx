import WriteNavigation from "@/app/ui/write/write_navigation";

export default function WriteNaviLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <WriteNavigation/>
        {children}
    </div>
  );
}
