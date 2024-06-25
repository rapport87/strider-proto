import getSession from "@/app/lib/session";
import { redirect } from "next/navigation";
import { getUser } from "@/app/lib/data";
import Link from "next/link";

import { UserIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export default async function Page() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="px-3 mt-3">
      {/* <h1 className="font-extrabold text-2xl mb-3">사용자</h1> */}
      <h2 className="font-semibold text-lg">{user?.user_name}님</h2>
      <div className="my-5 border-t border-solid border-gray-200 w-full mx-auto" />
      <ul>
        <li className="my-5">
          <Link className="w-full text-black" href="/user/category/">
            <div className="flex align-middle">
              <Cog6ToothIcon className="w-6 h-6" />
              <span className="ml-1">카테고리 설정</span>
            </div>
          </Link>
        </li>
      </ul>
      <div className="my-5 border-t border-solid border-gray-200 w-full mx-auto" />
      <div className="text-right">
        <button className="rounded-md border p-2 text-black hover:bg-gray-100">
          로그아웃
        </button>
      </div>
    </div>
  );
}
