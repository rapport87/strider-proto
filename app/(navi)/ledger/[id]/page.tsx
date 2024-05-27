import { getLedger, getLedgerDetails } from "@/app/lib/actions";
import getSession from "@/app/lib/session";
import ListLedgerDetail from "@/app/ui/components/ledger_detail_list";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ViewLedger({params} : {params: {id:number}}){
    const ledgerDetails = await getLedgerDetails(params.id);

    return (
        <div>
            <div>
                {ledgerDetails.map((ledgerDetail) => (
                    <ListLedgerDetail key={ledgerDetail.id} {...ledgerDetail}/>
                ))}
            </div>

            <div className="text-right">
                <Link className="text-black" href={`/ledger/${params.id}/write/income`}>가계부 작성</Link>
            </div>                
        </div>
    )
}