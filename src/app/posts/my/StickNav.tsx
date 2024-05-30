import { Button } from "@/components/ui/button";
import Link from "next/link";

export const StickyNav = () => {
  return (
    <nav className="bg-white sticky top-8 flex items-center gap-4 w-fit mx-auto border border-primary px-4 py-2 rounded-full">
      <Link href="#published">منشورة</Link>
      <Link href="#unpublished">غير منشورة</Link>
      <Link href="#drafts">مسودة</Link>
    </nav>
  );
};
