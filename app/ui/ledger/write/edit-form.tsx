"use client";

import { editLedgerDetail } from "@/app/lib/actions";
import { LedgerDetailProps } from "@/app/lib/defenitions";
import Button from "@/app/ui/components/button";
import Input from "@/app/ui/components/input";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import DeleteLedgerDetail from "./DeleteLedgerDetail";

interface Category {
  id: string;
  parent_id: string | null;
  category_code: number;
  category_name: string;
  is_active: boolean;
}

export default function EditLedgerDetailForm({
  category,
  ledgerDetail,
}: {
  category: Category[];
  ledgerDetail: LedgerDetailProps;
}) {
  const [state, dispatch] = useFormState(editLedgerDetail, null);

  const [selectedCategoryClass, setSelectedCategoryClass] = useState<number>(
    ledgerDetail.category_code
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

  const eventedAt = new Date(ledgerDetail.evented_at);

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
              defaultValue={ledgerDetail.asset_category_id}
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
              defaultValue={ledgerDetail.transaction_category_id}
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
          defaultValue={ledgerDetail.title}
        />
        <Input
          name="detail"
          type="text"
          placeholder="detail"
          required={true}
          minLength={1}
          errors={state?.fieldErrors.detail}
          defaultValue={ledgerDetail.detail || ""}
        />
        <Input
          name="price"
          type="number"
          placeholder="price"
          required={true}
          minLength={1}
          errors={state?.fieldErrors.price}
          defaultValue={ledgerDetail.price.toString()}
        />
        <Input
          name="evented_at"
          type="datetime-local"
          placeholder="evented_at"
          errors={state?.fieldErrors.evented_at}
          defaultValue={eventedAt.toISOString().slice(0, 16)}
        />
        <input
          name="category_code"
          value={selectedCategoryClass || ""}
          type="hidden"
        />
        <input name="id" value={ledgerDetail.id} type="hidden" />
        <input name="ledger_id" value={ledgerDetail.ledger_id} type="hidden" />
        <Button text="확인" />
      </form>
      <div className="text-right mt-1">
        <DeleteLedgerDetail
          ledger_id={ledgerDetail.ledger_id}
          ledger_detail_id={ledgerDetail.id}
        />
      </div>
    </div>
  );
}
