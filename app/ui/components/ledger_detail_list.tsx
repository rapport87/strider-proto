import Link from "next/link";
import { ListLedgerDetailProps } from "@/app/lib/defenitions"

function formatDateTime(date: Date) {
    const optionsDate: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit'
    };
    
    const optionsTime: Intl.DateTimeFormatOptions = { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    };

    const formattedDate = new Intl.DateTimeFormat('ko-KR', optionsDate).format(date);
    const formattedTime = new Intl.DateTimeFormat('ko-KR', optionsTime).format(date);

    return `${formattedDate.replace(/\s/g, '')} ${formattedTime}`;
}

export default function ListLedgerDetail({
    id, title, price, evented_at, asset_category_name ,transaction_category_name, category_code
} : ListLedgerDetailProps){
    return (
            <div className="border border-black p-2 mt-2">
                <div className="grid grid-cols-6 items-center text-center">
                    <span>{category_code === 1 ? "수입" : "지출"}</span>
                    <span>{transaction_category_name}</span>
                    <span>{asset_category_name}</span>
                    <span>{title}</span>
                    <span>{price}</span>
                    <span>{formatDateTime(new Date(evented_at))}</span>
                </div>
            </div>
    )
}