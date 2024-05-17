"use client"

import { setLedgerDeatil } from "@/app/lib/actions"
import Button from "@/app/ui/components/button";
import Input from "@/app/ui/components/input";
import { useFormState } from "react-dom";


export default function Write(){
    const [state, dispatch] = useFormState(setLedgerDeatil, null)
    return(
        <form action={dispatch}>
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

            {/* <Input 
                name="image"
                type="text" 
                placeholder="image"
                errors={state?.fieldErrors.image}
            /> */}

            <Button text="확인"/>
        </form>
    )
}