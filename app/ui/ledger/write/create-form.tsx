"use client";

import { writeLedgerDeatil } from "@/app/lib/actions";
import Button from "@/app/ui/components/button";
import Input from "@/app/ui/components/input";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

interface Category {
  id: number;
  parent_id: number | null;
  category_code: number;
  category_name: string;
  is_active: boolean;
}

interface WriteProps {
  category: Category[];
}

export default function CreateLedgerDetailForm({ category }: WriteProps) {
  const [state, dispatch] = useFormState(writeLedgerDeatil, null);
  const params = useParams();

  const [selectedCategoryClass, setSelectedCategoryClass] = useState<number>(1);
  const [assetCategory, setAssetCategory] = useState<Category[]>([]);
  const [transactionCategory, setTransactionCategory] = useState<Category[]>([]);

  useEffect(() => {
    if (selectedCategoryClass !== null) {
      const assetCategory = category.filter(cat => cat.category_code === 0 && cat.parent_id !== null && cat.is_active === true);
      const transactionCategory = category.filter(cat => cat.category_code === selectedCategoryClass && cat.is_active === true);
      setAssetCategory(assetCategory);
      setTransactionCategory(transactionCategory);
    }
  }, [selectedCategoryClass, category]);

  const handleCategoryClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategoryClass(Number(e.target.value));
  };

  return (
    <form action={dispatch}>
      <div>
        <input type="radio" name="category_class" value="1" onChange={handleCategoryClassChange} defaultChecked /> 수입
        <input type="radio" name="category_class" value="2" onChange={handleCategoryClassChange} /> 지출
      </div>

      <div>
        <div>
          <select className="w-full h-10" name="asset_category_id" required>
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
          <select className="w-full h-10" name="transaction_category_id" required>
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
      />
      <Input
        name="detail"
        type="text"
        placeholder="detail"
        required={true}
        minLength={1}
        errors={state?.fieldErrors.detail}
      />
      <Input
        name="price"
        type="number"
        placeholder="price"
        required={true}
        minLength={1}
        errors={state?.fieldErrors.price}
      />
      <Input
        name="evented_at"
        type="datetime-local"
        placeholder="evented_at"
        errors={state?.fieldErrors.evented_at}
      />
      <input
        name="category_code"
        value={selectedCategoryClass || ''}
        type="hidden"
      />
      <input
        name="ledger_id"
        value={params.id}
        type="hidden"
      />      
      <Button text="확인" />
    </form>
  );
}