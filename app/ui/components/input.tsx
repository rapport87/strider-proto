import { InputProps } from "@/app/lib/defenitions";
import { InputHTMLAttributes } from "react";
import { getCurrentDateTime } from "@/app/lib/utils";

export default function Input({
  name,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  const isDateTimeInput = rest.type === "datetime-local";

  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-green-500 border-none placeholder:text-neutral-400 px-2"
        defaultValue={isDateTimeInput ? getCurrentDateTime() : undefined}
        {...rest}
      />
      {errors?.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
