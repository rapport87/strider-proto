import Navigation from "@/app/ui/components/navigation";

export default function NaviLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        {children}
        <Navigation/>
    </div>
  );
}
