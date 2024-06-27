import { getCategoryGroup, getLedgerById } from "@/app/lib/data";
import getSession from "@/app/lib/session";
import EditLedgerForm from "@/app/ui/ledger/edit-form";
import { notFound } from "next/navigation";
import { WalletIcon } from "@heroicons/react/24/solid";

export default async function Page({
  params,
}: {
  params: { ledgerId: string };
}) {
  const id = params.ledgerId;
  const ledger = await getLedgerById(id);
  const categoryGroup = await getCategoryGroup();
  const user_id = (await getSession()).id;

  if (!ledger) {
    notFound();
  }
  return (
    <div className="px-3 mt-3">
      <div className="flex">
        <WalletIcon className="w-7 h-7" />
        <h1 className="ml-1 font-extrabold text-2xl mb-3">가계부 수정</h1>
      </div>
      <EditLedgerForm
        user_id={user_id}
        ledger={ledger}
        category_group={categoryGroup}
      />
    </div>
  );
}
