"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { editLedger } from "@/app/lib/actions";
import { SetDefaultLedger } from "@/app/ui/ledger/buttons";
import { DeleteLedger } from "@/app/ui/ledger/buttons";
import LedgerUsersTable from "@/app/ui/ledger/member-list";
import { EditLedgerProps } from "@/app/lib/defenitions";

export default function EditLedgerForm({
  user_id,
  ledger,
  categoryGroup,
}: EditLedgerProps) {
  const [state, dispatch] = useFormState(editLedger, null);
  const isDefaultLedger = ledger.userLedger.some(
    (user) => user.user_id === user_id && !user.is_default
  );

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
        <div>
          <select
            className="w-full h-10"
            name="user_category_group_id"
            required
            defaultValue={ledger.user_category_group_id}
          >
            {categoryGroup.map((catGrp) => (
              <option key={catGrp.id} value={catGrp.id}>
                {catGrp.category_group_name}
              </option>
            ))}
          </select>
        </div>
        <input name="ledger_id" value={ledger.id} type="hidden" />
        <Button text="가계부 수정하기" />
      </form>
      {isDefaultLedger && (
        <div className="flex mt-1">
          <div className="mr-auto">
            <SetDefaultLedger ledger_id={ledger.id} />
          </div>
          <div>
            <DeleteLedger ledger_id={ledger.id} />
          </div>
        </div>
      )}
      <div>
        <LedgerUsersTable
          user_id={user_id}
          ledger_id={ledger.id}
          userLedger={ledger.userLedger}
        />
      </div>
    </div>
  );
}
