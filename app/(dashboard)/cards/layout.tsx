"use client";

import Topbar from "@/components/shared/Topbar";
import { Plus } from "phosphor-react";

interface Props {
  children: React.ReactNode;
}

function layout({ children }: Props) {
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

export default layout;
