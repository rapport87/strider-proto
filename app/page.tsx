import Link from "next/link";
import Image from "next/image";
import women from "@/public/image/female.png";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <Image alt="women" src={women} width="150" height="150" />
        <h2 className="text-2xl">
          소금쟁이 가계부 프로토타입에 오신것을 환영합니다
        </h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link href="/sign-up" className="primary-btn text-lg py-2.5">
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline text-sky-500">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
