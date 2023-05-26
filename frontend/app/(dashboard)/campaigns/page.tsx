import CampaignCard from "@/components/campaigns/CampaignCard";

function CampaignsPage() {
  return (
    <div className="campaigns__items">
      {[1, 2, 3, 4, 5].map((item, index) => {
        return <CampaignCard key={index} />;
      })}
    </div>
  );
}

export default CampaignsPage;
