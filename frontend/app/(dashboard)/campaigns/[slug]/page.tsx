"use client";

import Comments from "@/components/campaigns/Comments";
import Image from "next/image";
import Link from "next/link";
import { CurrencyCircleDollar, User, UserCircle } from "phosphor-react";

function Page() {
  return (
    <div className="campaign">
      <div className="campaign__content">
        <div className="campaign__content__image">
          <Image
            width={800}
            height={400}
            alt="campiagn image"
            src="https://images.unsplash.com/photo-1522543558187-768b6df7c25c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fHBlb3BsZSUyMGxhbmRhc2NhcGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
          />
        </div>

        <div className="campaign__content__details">
          <h3 className="campaign__content__details-title">
            Donate to The National Black Bank Foundation
          </h3>
          <div className="campaign__content__details-description">
            <p>
              Join us in making a significant impact on economic equality and
              uplifting marginalized communities by supporting The National
              Black Bank Foundation. This crowdfunding campaign aims to provide
              crucial financial resources to empower Black-owned banks and
              promote economic growth within the Black community. With a rich
              history spanning decades, these institutions have played a pivotal
              role in fostering economic independence and addressing systemic
              disparities. Your contribution will directly support initiatives
              that amplify Black voices, encourage entrepreneurship, and build
              generational wealth, ultimately creating a more inclusive and
              equitable financial landscape.
            </p>
            <p>
              By donating to The National Black Bank Foundation, you are
              investing in the long-term prosperity of Black-owned businesses
              and individuals. Your support will enable the foundation to fund
              programs that provide capital, financial education, and mentorship
              to entrepreneurs and underserved communities. Through these
              initiatives, Black-owned banks can expand their lending capacity,
              offer affordable financial services, and promote homeownership,
              ultimately driving economic advancement and breaking the cycle of
              poverty. Together, we can dismantle barriers and foster a future
              where economic empowerment is a reality for all. Join us today in
              supporting The National Black Bank Foundation and become a
              catalyst for change.
            </p>
          </div>
        </div>

        <Comments />
      </div>

      {/* SIDEBAR */}
      <div className="campaign__sidebar">
        <div className="campaign__sidebar-stats">
          <div className="campaign__sidebar-stats__amount">
            <p>
              <span>{"$6,665"}</span> raised of {"$5,000"}
            </p>
          </div>

          <div className="progress-bar">
            <div className="progress-bar__progress" />
          </div>
        </div>

        <div className="action-btns">
          <Link href="/" className="default-button default-button-dark">
            <CurrencyCircleDollar size={15} weight="regular" />
            Donate
          </Link>
        </div>

        <div className="campaign__sidebar-owner">
          <div className="campaign__sidebar-owner__icon">
            <User size={16} weight="bold" />
          </div>

          <div className="campaign__sidebar-owner__details">
            <p className="owner">
              Organized by <span>Maxine Pittman</span>
            </p>
            <p className="date">Created on October 18, 2022</p>
          </div>
          {/* <p>
            Organized by <span>Maxine Pittman</span>
          </p> */}
        </div>

        <div className="campaign__sidebar-donations">
          {[
            {
              name: "Linda Johnson",
              amount: "$100",
              date: "6h ago",
              image: "https://i.pravatar.cc/50",
            },
            {
              name: "Randy Fisher",
              amount: "$89",
              date: "1d ago",
              image: "https://i.pravatar.cc/50",
            },
            {
              name: "Donbaki Johnson",
              amount: "$100",
              date: "2d ago",
              image: "https://i.pravatar.cc/50",
            },
          ].map((item, index) => {
            return (
              <div key={index} className="campaign__sidebar-donations-item">
                <div className="campaign__sidebar-donations-item__image">
                  <Image
                    width={800}
                    height={400}
                    alt="campiagn image"
                    src={item.image + "?img=" + (index + 1)}
                  />
                </div>

                <div className="campaign__sidebar-donations-item__details">
                  <p className="donator">{item.name}</p>
                  <div className="campaign__sidebar-donations-item__details-info">
                    <p className="amount">{item.amount}</p>
                    <p className="date">{item.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Page;
