import { getIronSession } from "iron-session";
import { SessionContent } from "@/app/lib/defenitions";
import { cookies } from "next/headers";

export default function getSession(){
    return getIronSession<SessionContent>(cookies(), {
        cookieName: "water-strider",
        password : process.env.COOKIE_PASSWORD!,
    }) 
}