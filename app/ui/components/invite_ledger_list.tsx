import Link from "next/link";
import { ListInvitedLedgerProps } from "@/app/lib/defenitions"
import { AgreeInviteButton, IgnoreInviteButton, RefuseInviteButton } from "../ledger/invite/buttons";

export default function InviteListLedger({
    id, user_id, ledger_id, ledger_name
} : ListInvitedLedgerProps){
    return (
        <div>
            <div className="border border-black p-2 mt-2">
                <div className="grid grid-cols-6 items-center text-center">
                    <span>{ledger_name}</span>
                    <span><AgreeInviteButton ledger_id={ledger_id}/></span>
                    <span><RefuseInviteButton ledger_id={ledger_id}/></span>
                    <span><IgnoreInviteButton ledger_id={ledger_id}/></span>
                </div>
            </div>                
        </div>
        
    )
}