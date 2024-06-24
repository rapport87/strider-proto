"use client";

import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { useFormState } from "react-dom";
import { editLedger } from "@/app/lib/actions";
import { SetDefaultLedger } from "@/app/ui/ledger/buttons";
import { DeleteLedger } from "@/app/ui/ledger/buttons";
import MemberList from "@/app/ui/ledger/member-list";
import { EditLedgerFormProps } from "@/app/lib/defenitions";

export default function EditLedgerForm({
  user_id,
  ledger,
  category_group,
}: EditLedgerFormProps) {
  const [state, dispatch] = useFormState(editLedger, null);
  const isDefaultLedger = ledger.user_ledger.some(
    (user) => user.user_id === user_id && !user.is_default
  );
  const ledgerName = ledger.user_ledger.find(
    (user) => user.user_id === user_id
  )?.ledger_name;

  return (
    <div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="ledgerName"
          type="text"
          placeholder="가계부 이름"
          defaultValue={ledgerName}
          required={true}
          errors={state?.fieldErrors.ledgerName}
        />
        <div>
          <select
            className="w-full h-10"
            name="userCategoryGroupId"
            required
            defaultValue={ledger.user_category_group_id}
          >
            {category_group.map((catGrp) => (
              <option key={catGrp.id} value={catGrp.id}>
                {catGrp.category_group_name}
              </option>
            ))}
          </select>
        </div>
        <input name="ledgerId" value={ledger.id} type="hidden" />
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
        <MemberList
          user_id={user_id}
          ledger_id={ledger.id}
          user_ledger={ledger.user_ledger}
        />
      </div>
    </div>
  );
}
