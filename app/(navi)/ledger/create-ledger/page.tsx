import { getCategoryGroup } from "@/app/lib/actions";
import CreateLedgerForm from "@/app/ui/ledger/create-form";

export default async function Page() {
  const categoryGroup = await getCategoryGroup();
  return <CreateLedgerForm categoryGroup={categoryGroup} />;
}
