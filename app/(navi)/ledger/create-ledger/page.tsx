import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { getCategoryGroup } from "@/app/lib/actions";
import CreateLedger from "@/app/ui/ledger/CreateLedger";

export default async function createLedger() {
  const categoryGroup = await getCategoryGroup();
  return <CreateLedger categoryGroup={categoryGroup} />;
}
