"use client";
import cn from "classnames";
import Searchbar from "./Searchbar";
import { CalendarBlank } from "phosphor-react";
import variables from "@/styles/core/variables.module.scss";

interface Props {
  title?: string;
  subtitle?: string;
  isCampaign?: boolean;
}
function Topbar({ title, subtitle, isCampaign = false }: Props) {
  return (
    <>
      <div className="c-topbar">
        <div className="c-topbar-action-btns">
          <div />
          <div className="c-topbar__actions">
            <button className="c-topbar__actions__button">
              Date range
              <CalendarBlank weight="bold" size={15} color={variables.dark} />
            </button>
            <button className="c-topbar__actions__button c-topbar__actions__button-dark">
              Start a campaign
            </button>
          </div>
        </div>

        {title || subtitle ? (
          <div className={cn("c-topbar-heading", isCampaign ? "campaign" : "")}>
            {title && <h1 className="c-topbar__title">{title}</h1>}
            {subtitle && (
              <p
                className={cn(
                  "c-topbar__subtitle",
                  isCampaign ? "campaign" : ""
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>

      {isCampaign && (
        <div className="c-topbar-filters-container">
          <Searchbar placeholder="Search campaigns" />

          <div className="c-topbar-filters">
            <button className="c-topbar-filters-btn">
              <span className="label">Categories</span>
              <span className="value">Education</span>
            </button>

            <button className="c-topbar-filters-btn">
              <span className="label">Goal</span>
              <span className="value">$10,000 - $20,000</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Topbar;
