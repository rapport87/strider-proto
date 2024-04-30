import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className = "flex flex-col items-center justify-between min-h-screen">
      <div>
        <h1>소금쟁이</h1>
        <h2>아끼자! 부자되자!</h2>
      </div>
      <div>
        <Link href="/sign-up">계정 만들기</Link>
      </div>
      <div>
        <span>이미 계정이 있나요?</span>
        <Link href="/login">로그인</Link>
      </div>
    </div>
  );
}
