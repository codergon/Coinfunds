import { Suspense } from "react";
import Donations from "./(dashboard)/donations/layout";
import Sidebar from "@/components/shared/Sidebar/Sidebar";

interface PageProps {
  children: React.ReactNode;
}

function Dashboard({ children }: PageProps) {
  return (
    <>
      <Suspense fallback="...">
        <Sidebar />
      </Suspense>
      <Donations />
    </>
  );
}

export default Dashboard;
