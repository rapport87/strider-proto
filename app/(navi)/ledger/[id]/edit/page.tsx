import { getLedger, getUser } from "@/app/lib/actions";
import getSession from "@/app/lib/session";
import EditLedger from "@/app/ui/ledger/edit/EditLedger";
import { notFound } from "next/navigation";

export default async function edit({params} : {params : {id : number}}) {
  const id = params.id
  const ledger = await getLedger(id);
  const user_id = Number((await getSession()).id);

  if(!ledger){
    notFound();
  }
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">가계부 수정하기</h1>
      </div>
      <EditLedger ledger={ledger} user_id={user_id}/>
    </div>
  );
}