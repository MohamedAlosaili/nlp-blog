import Link from "next/link";

export const Header = () => {
  return (
    <header className="flex items-center border-b border-main/25">
      <div className="w-full flex items-center gap-8 px-4 max-w-3xl mx-auto h-12">
        <Link href="/">مدونة معالجة اللغات الطبيعية</Link>
      </div>
    </header>
  );
};
