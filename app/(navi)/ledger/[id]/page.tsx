export default function ViewLedger({params} : {params: {id:number}}){
    const id = params.id;
    return (
        <div>{id} Ledger Page!</div>
    )
}