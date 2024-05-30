import CreateLedgerDetailForm from "@/app/ui/ledger/write/create-form";
import { getUserCategory } from "@/app/lib/actions";

export default async function WriteLedgerDetail() {
  const userCategory = await getUserCategory();
  return <CreateLedgerDetailForm category={userCategory} />;
}
