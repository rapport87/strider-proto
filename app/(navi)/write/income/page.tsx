import WriteUI from '@/app/ui/write/WriteUI';
import { getUserCategory } from '@/app/lib/actions';

export default async function income(){
    const userCategory = await getUserCategory(1);
    return <WriteUI category={userCategory} category_code={1}/>;
}