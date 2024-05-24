import { getLedger } from "@/app/lib/actions";
import ListLedger from "@/app/ui/components/ledger_list";
import Link from "next/link";

export default async function ledger(){
    const ledgerList = await getLedger();
    
    return (
        <div>
            {ledgerList.map((ledgerList) => (
                <ListLedger key={ledgerList.ledger_id} {...ledgerList}/>
            ))}
            <div className="text-right">
                <Link className="text-black" href={`/ledger/create-ledger`}>가계부 생성</Link>
            </div>            
        </div>
    )
}