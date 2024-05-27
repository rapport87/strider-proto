import { getLedger, getLedgerDetails } from "@/app/lib/actions";
import getSession from "@/app/lib/session";
import ListLedgerDetail from "@/app/ui/components/ledger_detail_list";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getIsOwner(userId:number){
    const session = await getSession();
    if(session.id){
        return session.id = userId
    }
    return false;
}

export default async function main(){
    const defaultLedger = (await getLedger()).filter(ledger => ledger.is_default === true);
    const ledgerDetails = await getLedgerDetails(defaultLedger[0].ledger_id);

    return (
        <div>
            <div>
                {ledgerDetails.map((ledgerDetail) => (
                    <ListLedgerDetail key={ledgerDetail.id} {...ledgerDetail}/>
                ))}
            </div>

            <div className="text-right">
                <Link className="text-black" href={`/ledger/${defaultLedger[0].ledger_id}/write/income`}>가계부 작성</Link>
            </div>
        </div>                
    )
}