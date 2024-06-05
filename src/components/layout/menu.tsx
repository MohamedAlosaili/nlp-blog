"use client";

import { MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useRef } from "react";
import Link from "next/link";

export const Menu = () => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menuContainer = document.getElementById("blog-menu");
    if (menuContainer && menuRef.current) {
      menuContainer.innerHTML = "";
      menuRef.current.hidden = false;
      menuContainer.appendChild(menuRef.current);
    }
  }, []);

  return (
    <div ref={menuRef} hidden>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <MenuIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <Link href="/">
              <DropdownMenuItem>الرئيسية</DropdownMenuItem>
            </Link>
            <Link href="/posts/my">
              <DropdownMenuItem>مقالاتي</DropdownMenuItem>
            </Link>
            <Link href="/profile/edit">
              <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
            </Link>
            <Link href="/posts/create">
              <DropdownMenuItem>مقال جديد</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
