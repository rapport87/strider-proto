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
        select : {
            id : true,
            title : true,
            price : true,
            evented_at : true
        }
    })
    return ledgerDetails
}

export default async function main({params} : {params : {id:string}}){
    // const id = Number(params.id);
    // if (isNaN(id)){
    //     return notFound();
    // }
    
    const ledgerDetails = await getLedgerDetails();

    return (
        <div>
            {ledgerDetails.map((ledgerDetail) => (
                <ListLedgerDetail key={ledgerDetail.id} {...ledgerDetail}/>
            ))}
        </div>
    )
}