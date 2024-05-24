"use client";

import { setLedgerDeatil } from "@/app/lib/actions";
import Button from "@/app/ui/components/button";
import Input from "@/app/ui/components/input";
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
  category_code: number;
}

export default function WriteUI({ category, category_code }: WriteProps) {
  const [state, dispatch] = useFormState(setLedgerDeatil, null);
  const asset_category = category.filter(cat => cat.category_code === 0 && cat.parent_id !== null && cat.is_active === true);
  const transaction_category = category.filter(cat => cat.category_code === category_code && cat.is_active === true);
  return (
    <form action={dispatch}>
      <div>
        <div>
          <select className="w-full h-10" name="asset_category_id" required>
            {asset_category.map((cat) => (
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
            {transaction_category.map((cat) => (
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
        value={category_code}
        type="hidden"
      />
      <Button text="확인" />
    </form>
  );
}