import CreateLedgerDetailForm from "@/app/ui/ledger/write/create-form";
import { getUserCategoryByLedgerId } from "@/app/lib/actions";

export default async function WriteLedgerDetail({
  params,
}: {
  params: { ledgerId: number };
}) {
  const userCategory = await getUserCategoryByLedgerId(params.ledgerId);
  return <CreateLedgerDetailForm category={userCategory} />;
}
