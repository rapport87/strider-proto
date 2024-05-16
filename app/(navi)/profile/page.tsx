import getSession from "@/app/lib/session";
import { redirect } from "next/navigation";
import { getUser } from "@/app/lib/actions";

export default async function Profile(){
    const user = await getUser();
    const logOut = async () => {
      "use server"
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
      </div>
    )
}