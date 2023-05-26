import DonationsTable from "./page";
import Topbar from "@/components/shared/Topbar";

interface DonationsPageProps {
  children?: React.ReactNode;
}

function Donations({ children }: DonationsPageProps) {
  return (
    <div className="donations">
      <Topbar />
      <div className="donations__content">{children}</div>
    </div>
  );
}

export default Donations;
