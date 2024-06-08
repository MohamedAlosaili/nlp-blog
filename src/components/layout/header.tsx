import Link from "next/link";
import { Menu } from "./menu";
import { getCookie } from "@/lib/cookies";
import { Logo } from "../icons/Logo";

export const Header = () => {
  const isLoggedIn = getCookie({ name: "session" });

  return (
    <header className="flex items-center border-b border-main/25">
      <div className="w-full flex items-center justify-between gap-8 px-4 max-w-3xl mx-auto h-12">
        <Link href="/" className="flex h-auto w-24 py-2 h-12">
          <Logo className="h-full w-full" />
        </Link>
        {isLoggedIn && <Menu />}
      </div>
    </header>
  );
};
