"use client"

import { useFormStatus } from "react-dom"
import { ButtonProps } from "@/app/lib/defenitions"

export default function Button({text} : ButtonProps){
    const { pending } = useFormStatus();
    return (
        <button disabled={pending}
         className="primary-btn h-10 
         disabled:bg-neutral-400 
         disabled:text-neutral-300 
         disabled:cursor-not-allowed">
            {pending ? "로그인 중 입니다..." : text}
        </button>
    )
}