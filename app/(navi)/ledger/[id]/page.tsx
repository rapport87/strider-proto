import { getLedger, getLedgerDetails } from "@/app/lib/actions";
import getSession from "@/app/lib/session";
import ListLedgerDetail from "@/app/ui/components/ledger_detail_list";
import { notFound } from "next/navigation";

export default async function ViewLedger({params} : {params: {id:number}}){
    const ledgerDetails = await getLedgerDetails(params.id);

    return (
        <div>
            {ledgerDetails.map((ledgerDetail) => (
                <ListLedgerDetail key={ledgerDetail.id} {...ledgerDetail}/>
            ))}
        </div>
    )
}