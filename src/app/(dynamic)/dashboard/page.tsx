import { getCurrentUser } from "@/helpers/getCurrentUser";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Users } from "./Users";
import { Posts } from "./Posts";

export const dynamic = "force-dynamic";

interface DashboardProps {
  searchParams: {
    tab?: "users" | "posts";
  };
}

const Dashboard = async ({ searchParams }: DashboardProps) => {
  const user = await getCurrentUser();

  if (!user || user?.role !== "admin") {
    notFound();
  }

  const activeTab = searchParams.tab ?? "users";

  return (
    <main className="page-style flex-col items-center">
      <Tabs tab={activeTab} />

      <div className="w-full mt-8">
        <Suspense
          fallback={
            <div className="flex justify-center items-center">
              <LoadingSpinner />
              تحميل...
            </div>
          }
        >
          {activeTab === "users" ? <Users user={user} /> : <Posts />}
        </Suspense>
      </div>
    </main>
  );
};

const Tabs = ({ tab }: DashboardProps["searchParams"]) => {
  return (
    <nav className="bg-white flex items-center w-fit mx-auto border border-primary rounded-full">
      <Link
        href="?tab=users"
        className={`px-8 py-2 ${
          tab === "users" ? "bg-black text-white rounded-full" : ""
        }`}
      >
        المستخدمين
      </Link>
      <Link
        href="?tab=posts"
        className={`px-8 py-2 ${
          tab === "posts" ? "bg-black text-white rounded-full" : ""
        }`}
      >
        المقالات
      </Link>
    </nav>
  );
};

export default Dashboard;
