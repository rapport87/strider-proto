import { getCategoryGroup } from "@/app/lib/actions";
import CreateLedger from "@/app/ui/ledger/CreateLedger";

export default async function Page() {
  const categoryGroup = await getCategoryGroup();
  return <CreateLedger categoryGroup={categoryGroup} />;
}
