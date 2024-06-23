import { getCategoryGroup } from "@/app/lib/data";
import CreateLedgerForm from "@/app/ui/ledger/create-form";

export default async function Page() {
  const categoryGroup = await getCategoryGroup();
  return <CreateLedgerForm category_group={categoryGroup} />;
}
