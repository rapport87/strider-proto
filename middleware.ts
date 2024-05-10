import { NextRequest, NextResponse } from "next/server";
import getSession from "@/app/lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/sign-up": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (session.id) {
    if (exists) {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
  } else {
    if (!exists) {
        return NextResponse.redirect(new URL("/", request.url));
      }    
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};