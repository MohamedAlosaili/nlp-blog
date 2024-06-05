import { Menu } from "@/components/layout/menu";

const DynamicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Menu />
      {children}
    </>
  );
};

export default DynamicLayout;
