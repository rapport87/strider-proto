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
        <ul className="w-full flex mb-5">
          <li className="mr-2">
            <input
              type="radio"
              id="income"
              name="categoryClass"
              className="hidden peer"
              value="1"
              onChange={handleCategoryClassChange}
              defaultChecked={selectedCategoryClass === 1}
              required
            />
            <label
              htmlFor="income"
              className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 "
            >
              <div className="block">
                <div className="w-full">수입</div>
              </div>
            </label>
          </li>
          <li>
            <input
              type="radio"
              id="expend"
              name="categoryClass"
              className="hidden peer"
              value="2"
              onChange={handleCategoryClassChange}
              defaultChecked={selectedCategoryClass === 2}
            />
            <label
              htmlFor="expend"
              className="inline-flex items-center p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100"
            >
              <div className="block">
                <div className="w-full">지출</div>
              </div>
            </label>
          </li>
        </ul>
        <div className="mb-5">
          <label
            htmlFor="price"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            날짜
          </label>
          <Input
            name="eventedAt"
            type="datetime-local"
            placeholder="evented_at"
            errors={state?.fieldErrors.eventedAt}
            defaultValue={eventedAt}
          />
        </div>
        <div className="mt-3">
          <div>
            <label
              htmlFor="assetCategoryId"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              자산 분류
            </label>
            <select
              className="w-block w-full h-10 p-2 mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500"
              id="assetCategoryId"
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
            <label
              htmlFor="transactionCategoryId"
              className="block mb-1 text-sm font-medium text-gray-900"
            >
              거래 분류
            </label>
            <select
              className="w-block w-full h-10 p-2 mb-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              id="transactionCategoryId"
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

        <div className="mb-5">
          <label
            htmlFor="title"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            제목
          </label>
          <Input
            name="title"
            type="text"
            placeholder="title"
            required={true}
            minLength={1}
            errors={state?.fieldErrors.title}
            defaultValue={ledgerDetail ? ledgerDetail.title : ""}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="price"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            금액
          </label>
          <Input
            name="price"
            type="number"
            placeholder="price"
            required={true}
            minLength={1}
            errors={state?.fieldErrors.price}
            defaultValue={ledgerDetail ? ledgerDetail.price.toString() : ""}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="detail"
            className="block mb-1 text-sm font-medium text-gray-900"
          >
            상세 내역
          </label>
          <Input
            name="detail"
            type="text"
            placeholder="detail"
            required={true}
            minLength={1}
            errors={state?.fieldErrors.detail}
            defaultValue={ledgerDetail ? ledgerDetail.detail || "" : ""}
          />
        </div>

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
