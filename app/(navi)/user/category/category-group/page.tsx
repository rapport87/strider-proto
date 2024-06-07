import Link from "next/link";

export default async function categoryGroup() {
  return (
    <div>
      <div>
        <Link href="/user/category/create-category">
          <button className="primary-btn p-2 text-black disabled:bg-neutral-400 disabled:text-neutral-300">
            카테고리 그룹 추가
          </button>
        </Link>
      </div>
    </div>
  );
}
