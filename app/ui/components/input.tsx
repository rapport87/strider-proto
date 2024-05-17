import { InputProps } from "@/app/lib/defenitions"
import { InputHTMLAttributes } from "react"

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function Input({
    name, 
    errors = [], 
    ...rest
} : InputProps & InputHTMLAttributes<HTMLInputElement>) {

    const isDateTimeInput = rest.type === 'datetime-local';

    return (
        <div className="flex flex-col gap-2">
            <input
                name={name}
                className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-green-500 border-none placeholder:text-neutral-400 px-2"
                defaultValue={isDateTimeInput ? getCurrentDateTime() : undefined}
                {...rest}
            />
            {errors?.map((error, index) => (
                <span key={index} className="text-red-500 font-medium">{error}</span>
            ))}
        </div>
    )
}