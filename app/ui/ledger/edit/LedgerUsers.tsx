import { RevokeInviter } from "./RevokeInviter";
import { TransferLedger } from "./TransferLedger";

interface User {
    user_id : number;
    user_name : string;
    is_owner : boolean;
    is_default : boolean;
  }
  
interface UserLedgerProps {
    user_id : number;
    ledger_id: number;
    userLedger: User[];
}

export default async function LedgerUsers({user_id, ledger_id, userLedger} : UserLedgerProps){
    const isOwner = userLedger.some(user => user.user_id === user_id && user.is_owner);
    return (
        <div>
            <div className="mt-5">
                <h2>가계부 사용자</h2>  
            </div>
            {userLedger.map((user) => (
                <div className="flex" key={user.user_id}>
                    <span>{user.user_name}</span>
                    
                    {isOwner && user_id !== user.user_id ?
                        <> 
                        <span><RevokeInviter ledger_id={ledger_id} user_id={user.user_id} /></span>
                        <span><TransferLedger ledger_id={ledger_id} user_id={user.user_id} /></span>
                        </>
                    : ""}
                </div>
            ))}
        </div>
    )
}