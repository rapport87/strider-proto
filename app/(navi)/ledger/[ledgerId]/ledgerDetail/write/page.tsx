import LedgerDetailForm from "@/app/ui/ledger/ledger-detail/ledger-detail-form";
import { getUserCategoryByIdByLedgerId } from "@/app/lib/data";

export default async function Page({
  params,
}: {
  params: { ledgerId: string };
}) {
  const userCategory = await getUserCategoryByIdByLedgerId(params.ledgerId);
  return <LedgerDetailForm category={userCategory} />;
}
