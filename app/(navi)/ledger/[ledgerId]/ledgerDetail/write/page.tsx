import CreateLedgerDetailForm from "@/app/ui/ledger/write/create-form";
import { getUserCategoryByLedgerId } from "@/app/lib/actions";

export default async function Page({
  params,
}: {
  params: { ledgerId: string };
}) {
  const userCategory = await getUserCategoryByLedgerId(params.ledgerId);
  return <CreateLedgerDetailForm category={userCategory} />;
}
