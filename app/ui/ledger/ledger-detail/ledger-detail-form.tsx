"use client";

import { useFormState } from "react-dom";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { createLedgerDetail, editLedgerDetail } from "@/app/lib/actions";
import { LedgerDetailFormProps, UserCategory } from "@/app/lib/defenitions";
import DeleteLedgerDetail from "@/app/ui/ledger/ledger-detail/buttons";

export default function LedgerDetailForm({
  category,
  ledgerDetail,
  isEdit = false,
}: LedgerDetailFormProps) {
  const [state, dispatch] = useFormState(
    isEdit ? editLedgerDetail : createLedgerDetail,
    null
  );
  const params = useParams();

  const [selectedCategoryClass, setSelectedCategoryClass] = useState<number>(
    ledgerDetail ? ledgerDetail.category_code : 1
  );
  const [assetCategory, setAssetCategory] = useState<UserCategory[]>([]);
  const [transactionCategory, setTransactionCategory] = useState<
    UserCategory[]
  >([]);

  useEffect(() => {
    if (selectedCategoryClass !== null) {
      const assetCategory = category.filter(
        (cat) =>
          cat.category_code === 0 &&
          cat.parent_id !== null &&
          cat.is_active === true
      );
      const transactionCategory = category.filter(
        (cat) =>
          cat.category_code === selectedCategoryClass && cat.is_active === true
      );
      setAssetCategory(assetCategory);
      setTransactionCategory(transactionCategory);
    }
  }, [selectedCategoryClass, category]);

  const handleCategoryClassChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedCategoryClass(Number(e.target.value));
  };

  const eventedAt = ledgerDetail
    ? moment(ledgerDetail.evented_at)
        .tz("Asia/Seoul")
        .format("YYYY-MM-DDTHH:mm")
    : moment().tz("Asia/Seoul").format("YYYY-MM-DDTHH:mm");

  return (
    <div>
      <form action={dispatch}>
        <div>
          <input
            type="radio"
            name="categoryClass"
            value="1"
            onChange={handleCategoryClassChange}
            defaultChecked={selectedCategoryClass === 1}
          />{" "}
          수입
          <input
            type="radio"
            name="categoryClass"
            value="2"
            onChange={handleCategoryClassChange}
            defaultChecked={selectedCategoryClass === 2}
          />{" "}
          지출
        </div>

        <div>
          <div>
            <select
              className="w-full h-10"
              name="assetCategoryId"
              required
              defaultValue={ledgerDetail ? ledgerDetail.asset_category_id : ""}
            >
              {assetCategory.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div>
            <select
              className="w-full h-10"
              name="transactionCategoryId"
              required
              defaultValue={
                ledgerDetail ? ledgerDetail.transaction_category_id : ""
              }
            >
              {transactionCategory.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          name="title"
          type="text"
          placeholder="title"
          required={true}
          minLength={1}
          errors={state?.fieldErrors.title}
          defaultValue={ledgerDetail ? ledgerDetail.title : ""}
        />
        <Input
          name="detail"
          type="text"
          placeholder="detail"
          required={true}
          minLength={1}
          errors={state?.fieldErrors.detail}
          defaultValue={ledgerDetail ? ledgerDetail.detail || "" : ""}
        />
        <Input
          name="price"
          type="number"
          placeholder="price"
          required={true}
          minLength={1}
          errors={state?.fieldErrors.price}
          defaultValue={ledgerDetail ? ledgerDetail.price.toString() : ""}
        />
        <Input
          name="eventedAt"
          type="datetime-local"
          placeholder="evented_at"
          errors={state?.fieldErrors.eventedAt}
          defaultValue={eventedAt}
        />
        <input
          name="categoryCode"
          value={selectedCategoryClass || ""}
          type="hidden"
        />
        {ledgerDetail ? (
          <>
            <input name="id" value={ledgerDetail.id} type="hidden" />
            <input
              name="ledgerId"
              value={ledgerDetail.ledger_id}
              type="hidden"
            />
          </>
        ) : (
          <input name="ledgerId" value={params.ledgerId} type="hidden" />
        )}
        <Button text="확인" />
      </form>
      {isEdit && ledgerDetail && (
        <div className="text-right mt-1">
          <DeleteLedgerDetail
            ledgerId={ledgerDetail.ledger_id}
            ledgerDetailId={ledgerDetail.id}
          />
        </div>
      )}
    </div>
  );
}
