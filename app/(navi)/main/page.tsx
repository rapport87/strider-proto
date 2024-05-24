import { getLedger, getLedgerDetails } from "@/app/lib/actions";
import getSession from "@/app/lib/session";
import ListLedgerDetail from "@/app/ui/components/ledger_detail_list";
import { notFound } from "next/navigation";

async function getIsOwner(userId:number){
    const session = await getSession();
    if(session.id){
        return session.id = userId
    }
    return false;
}

export default async function main(){
    const ledgers = await getLedger();
    const defaultLedger = ledgers.filter(ledger => ledger.is_default === true);
    const ledgerDetails = await getLedgerDetails(defaultLedger[0].ledger_id);

    return (
        <div>
            {ledgerDetails.map((ledgerDetail) => (
                <ListLedgerDetail key={ledgerDetail.id} {...ledgerDetail}/>
            ))}
        </div>
    )
}