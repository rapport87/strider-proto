import Link from "next/link";
import { ListLedgerProps } from "@/app/lib/defenitions"

export default function ListLedger({
    ledger_id, ledger_name, is_default, is_owner
} : ListLedgerProps){
    return (
        <div>
            <div className="border border-black p-2 mt-2">
                <div className="grid grid-cols-6 items-center text-center">
                    <span>{ledger_name}</span>
                    <span><Link className="text-black" href={`/ledger/${ledger_id}`}>승인</Link></span>
                    <span><Link className="text-black" href={`/ledger/${ledger_id}/edit`}>거절</Link></span>
                    <span><Link className="text-black" href={`/ledger/${ledger_id}/invite`}>무시</Link></span>
                    <span>{is_default === true ? "기본" : ""}</span>
                    <span>{is_owner === true ? "" : "🤝"}</span>
                </div>
            </div>                
        </div>
        
    )
}