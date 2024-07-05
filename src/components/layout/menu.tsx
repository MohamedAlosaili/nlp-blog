"use client";

import { MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { logoutAction } from "@/app/action";

export const Menu = () => {
  return (
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
          <DropdownMenuItem
            onClick={() => logoutAction()}
            className="hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600"
          >
            تسجيل الخروج
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
