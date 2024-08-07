import { Logo } from "../icons/Logo";

export const Footer = () => (
  <footer className="transition-all flex items-center border-t border-main/25 pb-[env(safe-area-inset-bottom)]">
    <div className="w-full flex items-center justify-center h-8 px-4 text-sm max-w-3xl mx-auto">
      جميع الحقوق محفوظة &copy; <Logo className="mx-1 w-10 h-auto" />
    </div>
  </footer>
);
