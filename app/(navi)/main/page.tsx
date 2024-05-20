import db from "@/app/lib/db"
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

async function getLedgerDetails(){
    const user = await getSession();
    const ledgerDetails = db.ledger_detail.findMany({
        where: {
            ledger: {
              userLedger: {
                every: {
                  user_id: user.id,
                },
              },
            },
          },
    })
    return ledgerDetails
}

export default async function main(){
    
    const ledgerDetails = await getLedgerDetails();

    return (
        <div>
            {ledgerDetails.map((ledgerDetail) => (
                <ListLedgerDetail key={ledgerDetail.id} {...ledgerDetail}/>
            ))}
        </div>
    )
}