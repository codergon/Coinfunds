"use client";

import { Plus } from "phosphor-react";
import Topbar from "@/components/shared/Topbar";

type CardsPageProps = {
  children: React.ReactNode;
};

function CardsPageLayout({ children }: CardsPageProps) {
  return (
    <div className="cards">
      <Topbar
        title="Cards & Wallets"
        subtitle=" Connect your card or wallet to your account to start donating to
            campaigns."
      />
      <div className="cards__content">
        {children}

        <div className="cards__actions">
          <button className="c-button c-button--dark has-icon">
            <Plus size={14} weight="bold" />
            <span>New card</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardsPageLayout;
