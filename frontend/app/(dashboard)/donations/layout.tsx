import DonationsTable from "./page";
import Topbar from "@/components/shared/Topbar";

interface PageProps {
  children?: React.ReactNode;
}

function Donations({ children }: PageProps) {
  return (
    <div className="donations">
      <Topbar />
      <div className="donations__content">
        <DonationsTable />
      </div>
    </div>
  );
}

export default Donations;
