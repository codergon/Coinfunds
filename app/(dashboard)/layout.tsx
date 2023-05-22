import Sidebar from "@/components/shared/Sidebar/Sidebar";
import React, { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

function Dashboard({ children }: Props) {
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
