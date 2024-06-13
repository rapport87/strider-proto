import getSession from "@/app/lib/session";
import { redirect } from "next/navigation";
import { getUser } from "@/app/lib/data";
import Link from "next/link";

export default async function Page() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div>
      <div>{user?.user_name}님</div>
      <div>
        <form action={logOut}>
          <button>로그아웃</button>
        </form>
      </div>
      <div>
        <Link href="/user/category/">
          <button className="rounded-md border p-2 text-black hover:bg-gray-100">
            카테고리 설정
          </button>
        </Link>
      </div>
    </div>
  );
}
