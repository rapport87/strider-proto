"use client";

import { useFormState } from "react-dom";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import Input from "@/app/ui/components/input";
import Button from "@/app/ui/components/button";
import { createLedgerDetail, editLedgerDetail } from "@/app/lib/actions";
import { Category, LedgerDetailProps } from "@/app/lib/defenitions";
import DeleteLedgerDetail from "@/app/ui/ledger/ledger-detail/buttons";

interface LedgerDetailFormProps {
  category: Category[];
  ledgerDetail?: LedgerDetailProps;
  isEdit?: boolean;
}

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
  const [assetCategory, setAssetCategory] = useState<Category[]>([]);
  const [transactionCategory, setTransactionCategory] = useState<Category[]>(
    []
  );

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
            name="category_class"
            value="1"
            onChange={handleCategoryClassChange}
            defaultChecked={selectedCategoryClass === 1}
          />{" "}
          수입
          <input
            type="radio"
            name="category_class"
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
              name="asset_category_id"
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
              name="transaction_category_id"
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
          name="evented_at"
          type="datetime-local"
          placeholder="evented_at"
          errors={state?.fieldErrors.evented_at}
          defaultValue={eventedAt}
        />
        <input
          name="category_code"
          value={selectedCategoryClass || ""}
          type="hidden"
        />
        {ledgerDetail ? (
          <>
            <input name="id" value={ledgerDetail.id} type="hidden" />
            <input
              name="ledger_id"
              value={ledgerDetail.ledger_id}
              type="hidden"
            />
          </>
        ) : (
          <input name="ledger_id" value={params.ledgerId} type="hidden" />
        )}
        <Button text="확인" />
      </form>
      {isEdit && ledgerDetail && (
        <div className="text-right mt-1">
          <DeleteLedgerDetail
            ledger_id={ledgerDetail.ledger_id}
            ledger_detail_id={ledgerDetail.id}
          />
        </div>
      )}
    </div>
  );
}
