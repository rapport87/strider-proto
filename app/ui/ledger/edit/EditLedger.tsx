"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { updateLedger } from "@/app/lib/actions";
import { SetDefaultLedger } from "./SetDefaultLedger";
import getSession from "@/app/lib/session";
import { DeleteLedger } from "./DeleteLedger";
import LedgerUsers from "./LedgerUsers";

interface User {
  user_id : number;
  user_name : string;
  is_owner : boolean;
  is_default : boolean;
}

interface ledgerEditForm {
  id : number;
  ledger_name : string;
  userLedger : User[]
}

export default function EditLedger({user_id, ledger} : {user_id : number, ledger : ledgerEditForm}) {
  const [state, dispatch] = useFormState(updateLedger, null)
  const isDefaultLedger = ledger.userLedger.some(user => user.user_id === user_id && !user.is_default);

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input 
            name="ledger_name"
            type="text"
            placeholder="가계부 이름"
            defaultValue={ledger.ledger_name}
            required={true}
            errors={state?.fieldErrors.ledger_name}
        />
        <input
            name="ledger_id"
            value={ledger.id}
            type="hidden"
        />                
        <Button
            text="가계부 수정하기"
        />
      </form>
      {isDefaultLedger &&
      <div className="flex mt-1">
        <div className="mr-auto">
          <SetDefaultLedger ledger_id={ledger.id}/>
        </div>
        <div>
          <DeleteLedger ledger_id={ledger.id}/>
        </div>
      </div>
      }
      <div>
        <LedgerUsers user_id={user_id} ledger_id={ledger.id} userLedger={ledger.userLedger}/>
      </div>
    </div>
  );
}