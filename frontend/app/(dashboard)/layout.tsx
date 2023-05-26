import { Suspense } from "react";
import Sidebar from "@/components/shared/Sidebar/Sidebar";
import ProgressBar from "../progressbar";
import { AppProps } from "next/app";

interface PageProps extends AppProps {
  children: React.ReactNode;
}

function Dashboard({ children }: PageProps) {
  return (
    <>
      <ProgressBar />
      <Suspense fallback="...">
        <Sidebar />
      </Suspense>
      {children}
    </>
  );
}

export default Dashboard;
