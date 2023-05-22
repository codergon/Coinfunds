"use client";

import { CopySimple, DotsThree, DotsThreeOutline } from "phosphor-react";
import CardCanvas from "./CardCanvas";
import Issuers, { CardChip } from "./Issuers";
import { useState } from "react";
import { constrictAddress } from "@/utils/wallet";

import useAppMenu from "@/hooks/useAppMenu";

interface CardProp {
  colorsIndex: number;
}

const Card = ({ colorsIndex }: CardProp) => {
  const reveal = !true;
  const cardNumber = "5170 7645 4356 0284";
  const [hovered, sethovered] = useState(false);

  const testWallet = "0xfe83aa8439a8699a25ca47d81e9be430f5476f93";

  const isWallet = colorsIndex % 3 === 0;

  const [AppMenu, activeOption] = useAppMenu("delete", ["delete"]);

  return (
    <div
      className="c-card"
      onPointerEnter={() => sethovered(true)}
      onPointerLeave={() => sethovered(false)}
    >
      <CardCanvas colorsIndex={colorsIndex} hovered={hovered} />

      <div className="c-card__content">
        <div className="c-card-row start">
          <h2 className="c-card__displayname">Alphaknight 🦅</h2>

          <AppMenu>
            <button className="option-btn">
              <DotsThreeOutline size={15} weight="fill" />
            </button>
          </AppMenu>
        </div>

        <div className="c-card__details">
          <div className="c-card__details-info-container">
            <div className="c-card__details-info">
              <button className="action-button addr-cardNum">
                {isWallet ? (
                  <>{constrictAddress(testWallet, 6, 6)}</>
                ) : (
                  cardNumber
                    .replace(/ +/g, "")
                    .match(/.{1,4}/g)
                    ?.map((subnum, index) => {
                      return (
                        <span key={index}>
                          {index === 0 || reveal ? subnum : "****"}
                        </span>
                      );
                    })
                )}
                {(reveal || isWallet) && <CopySimple size={16} />}
              </button>

              {!isWallet && (
                <div className="c-card-row gapped">
                  <button className="action-button">
                    <span>01/26</span>
                    <CopySimple size={16} />
                  </button>
                  <button className="action-button">
                    <span>425</span>
                    <CopySimple size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="c-card__details-chip">
              {!isWallet && <CardChip size={30} />}
            </div>
          </div>

          <div className="c-card-row end">
            <p className="c-card__username">Kester A</p>

            <div className="c-card__type">
              {
                <Issuers
                  type={isWallet ? "metamask" : "mastercard"}
                  size={40}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
