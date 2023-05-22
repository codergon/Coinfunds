import CampaignCard from "@/components/campaigns/CampaignCard";

function page() {
  return (
    <div className="campaigns__items">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
        return <CampaignCard key={index} />;
      })}
    </div>
  );
}

export default page;
