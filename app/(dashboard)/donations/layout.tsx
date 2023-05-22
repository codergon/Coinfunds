import DonationsTable from "./page";
import Topbar from "@/components/shared/Topbar";

interface Props {
  children?: React.ReactNode;
}

function Donations({ children }: Props) {
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
