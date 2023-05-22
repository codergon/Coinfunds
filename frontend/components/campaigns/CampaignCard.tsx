"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

function CampaignCard() {
  const router = useRouter();

  const openCampaign = () => {
    router.push(`/campaigns/${"zx5y-sf65"}`);
  };

  return (
    <button className="campaigns__card" onClick={openCampaign}>
      <div className="campaigns__card__image">
        <Image
          width={800}
          height={400}
          src="https://images.pexels.com/photos/9140212/pexels-photo-9140212.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
          alt="campaign"
        />
      </div>
      <div className="campaigns__card__details">
        <h3 className="campaigns__card__details-category">
          Education & Learning
        </h3>
        <h3 className="campaigns__card__details-title">
          Empower Linda to get a new laptop
        </h3>
        <p className="campaigns__card__details-subtitle">
          Linda is a student at the University of Lagos, Nigeria. She is a
          computer science student and she is in her final year. She is
          currently using a 2012 MacBook Pro and it is not in good condition.
        </p>

        <div className="campaigns__card__details-stats">
          <div className="campaigns__card__details-stats__amount">
            <p>
              <span>{"$6,665"}</span> raised of {"$5,000"}
            </p>
          </div>

          <div className="progress-bar">
            <div className="progress-bar__progress" />
          </div>
        </div>
      </div>
    </button>
  );
}

export default CampaignCard;
