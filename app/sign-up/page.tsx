import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import FormInput from "@/app/ui/components/form-input";
import FormButton from "@/app/ui/components/form-btn";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">회원가입</h1>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput 
            name="email"
            type="email" 
            placeholder="E-mail" 
            required={true}
            errors={[]} 
        />
        <FormInput 
            name="username"
            type="text" 
            placeholder="Username" 
            required={true}
            errors={[]} 
        />
        <FormInput 
            name="password"
            type="password" 
            placeholder="Password" 
            required={true}
            errors={[]} 
        />
        <FormInput 
            name="confirm_password"
            type="password" 
            placeholder="Confirm Password" 
            required={true}
            errors={[]} 
        />                        
        <FormButton
            text="계정 생성하기"
        />
      </form>
      <div className="w-full h-px bg-neutral-500" />
      <div>
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-2"
          href="/sms"
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
          </span>
          <span>휴대전화(SMS) 회원가입</span>
        </Link>
      </div>
    </div>
  );
}