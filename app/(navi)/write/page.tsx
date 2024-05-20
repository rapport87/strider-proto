import WriteUI from '@/app/ui/write/WriteUI';
import { getUserCategory } from '@/app/lib/actions';

export default async function Write() {
    const userCategory = await getUserCategory()
    return <WriteUI category={userCategory} transaction_type={0} />;
}