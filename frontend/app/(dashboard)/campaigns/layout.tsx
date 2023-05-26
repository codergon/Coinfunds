import { AppProps } from "next/app";
import CampaignsPage from "./page";
import Topbar from "@/components/shared/Topbar";

type PageProps = {
  isComponent?: boolean;
  children?: React.ReactNode;
};

function Campaigns({ children, isComponent }: PageProps) {
  return (
    <div className="campaigns">
      <Topbar
        isCampaign
        title="Campaigns"
        subtitle=" Explore active campaigns and start your own. 100% of your donation
            goes to the campaign owner and you can withdraw your donation at any
            time."
      />
      <div className="campaigns__content">
        {!isComponent ? children : <CampaignsPage />}
      </div>
    </div>
  );
}

export default Campaigns;
