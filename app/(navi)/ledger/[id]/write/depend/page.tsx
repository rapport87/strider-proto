import WriteUI from '@/app/ui/ledger/write/WriteUI';
import { getUserCategory } from '@/app/lib/actions';

export default async function depend(){
    const userCategory = await getUserCategory(2);
    return <WriteUI category={userCategory} category_code={2} />;
}