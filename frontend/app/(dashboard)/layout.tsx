import Sidebar from "@/components/shared/Sidebar/Sidebar";
import React, { Suspense } from "react";

interface PageProps {
  children: React.ReactNode;
}

function Dashboard({ children }: PageProps) {
  return (
    <>
      <Suspense fallback="...">
        <Sidebar />
      </Suspense>
      {children}
    </>
  );
}

export default Dashboard;
