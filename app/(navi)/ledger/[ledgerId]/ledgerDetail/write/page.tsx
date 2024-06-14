import CreateLedgerDetailForm from "@/app/ui/ledger/ledger-detail/create-form";
import { getUserCategoryByIdByLedgerId } from "@/app/lib/data";

export default async function Page({
  params,
}: {
  params: { ledgerId: string };
}) {
  const userCategory = await getUserCategoryByIdByLedgerId(params.ledgerId);
  return <CreateLedgerDetailForm category={userCategory} />;
}
