import Navigation from "../ui/components/navigation";

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
