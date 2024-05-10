import getSession from "@/app/lib/session";
import db from "@/app/lib/db";
import { notFound, redirect } from "next/navigation";

async function getUser() {
    const session = await getSession();
    if (session.id) {
      const user = await db.user.findUnique({
        where: {
          id: session.id,
        },
      });
      if (user) {
        return user;
      }
    }
    notFound();
  }


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