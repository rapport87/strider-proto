import { getIronSession } from "iron-session";
import { SessionContentProps } from "@/app/lib/defenitions";
import { cookies } from "next/headers";

export default function getSession(){
    return getIronSession<SessionContentProps>(cookies(), {
        cookieName: "water-strider",
        password : process.env.COOKIE_PASSWORD!,
    }) 
}