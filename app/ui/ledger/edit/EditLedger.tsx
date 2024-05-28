"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { updateLedger } from "@/app/lib/actions";

interface User {
  user_id : number;
}

interface ledgerEditForm {
  id : number;
  ledger_name : string;
  userLedger : User[]
}

export default function EditLedger({ledger} : {ledger : ledgerEditForm}) {
  const [state, dispatch] = useFormState(updateLedger, null)
  
  return (
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
  );
}