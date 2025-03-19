// layout.tsx
import { SessionData } from "@/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import NavbarAkademik from "~/components/admin/Navbar";
import SidebarAkademik from "~/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "School Of Technopreneur Nusantara || Admin",
};

export default async function AkademikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await SessionData();

  if (!session || !session.user.token || session.user.role !== "Admin") {
    redirect("/404");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarAkademik />
      <div className="flex-1 min-w-0">
        <NavbarAkademik />
        <main className="md:p-4  overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
