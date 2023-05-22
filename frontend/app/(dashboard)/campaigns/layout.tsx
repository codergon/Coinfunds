import Topbar from "@/components/shared/Topbar";

interface PageProps {
  children: React.ReactNode;
}

function layout({ children }: PageProps) {
  return (
    <div className="campaigns">
      <Topbar
        isCampaign
        title="Campaigns"
        subtitle=" Explore active campaigns and start your own. 100% of your donation
            goes to the campaign owner and you can withdraw your donation at any
            time."
      />
      <div className="campaigns__content">{children}</div>
    </div>
  );
}

export default layout;
