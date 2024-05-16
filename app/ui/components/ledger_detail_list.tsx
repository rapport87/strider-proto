import Link from "next/link";

interface ListLedgerDetailProps{
    id : number;
    title : string;
    price : number;
    evented_at : Date;
}

export default function ListLedgerDetail({
    id, title, price, evented_at
} : ListLedgerDetailProps){
    return (
        <div className="border border-black p-2">
            <div>
                <span>{title}</span>
                <span>{price}</span>
                <span>{evented_at.toString()}</span>
            </div>
        </div>
    )
}