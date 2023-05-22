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
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil
              deleniti sunt explicabo molestiae, quisquam eveniet totam minima
              sit pariatur. Ex molestiae a dolores enim quis velit deleniti
              numquam excepturi expedita? Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Excepturi perferendis velit ut? Quia, dicta
              veniam nemo ea esse qui ullam deserunt sed illum rerum. Mollitia
              unde suscipit debitis, dignissimos maxime adipisci quo veritatis
              ut hic nemo similique magnam quasi reiciendis ullam sit sint ex
              cum sed asperiores dolorum recusandae sequi et quae. Repellendus,
            </p>
            <p>
              adipisci, consectetur, consequatur laborum corporis. Mollitia
              voluptates quis ipsum quidem dolorum blanditiis a quasi dolores,
              cumque at voluptatem ratione id porro aliquam? Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Quidem dolorum doloribus
              tempore quod reiciendis dolor consectetur consequatur illo
              voluptatem. Vero expedita suscipit repellendus soluta veniam quae
              atque debitis minus voluptatum.
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
          {[1, 2, 3, 4].map((item, index) => {
            return (
              <div key={index} className="campaign__sidebar-donations-item">
                <div className="campaign__sidebar-donations-item__image">
                  <Image
                    width={800}
                    height={400}
                    alt="campiagn image"
                    src="https://i.pravatar.cc/300"
                  />
                </div>

                <div className="campaign__sidebar-donations-item__details">
                  <p className="donator">Donbaki Johnson</p>
                  <div className="campaign__sidebar-donations-item__details-info">
                    <p className="amount">{"$100"}</p>
                    <p className="date">25d ago</p>
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
