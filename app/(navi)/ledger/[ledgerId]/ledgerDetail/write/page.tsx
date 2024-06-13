import CreateLedgerDetailForm from "@/app/ui/ledger/ledger-detail/create-form";
import { getUserCategoryByLedgerId } from "@/app/lib/data";

export default async function Page({
  params,
}: {
  params: { ledgerId: string };
}) {
  const userCategory = await getUserCategoryByLedgerId(params.ledgerId);
  return <CreateLedgerDetailForm category={userCategory} />;
}
