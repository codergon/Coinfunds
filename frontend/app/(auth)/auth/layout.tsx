"use client";

import { Plus } from "phosphor-react";

interface PageProps {
  children: React.ReactNode;
}

function layout({ children }: PageProps) {
  return (
    <div className="auth">
      {children}
      <div className="auth__footer">
        <h1>Coinfunds - &nbsp;</h1>
        <p>
          powered by{" "}
          <a target="_blank" href="https://www.circle.com/en/usdc">
            Circle USDC
          </a>
        </p>
      </div>
    </div>
  );
}

export default layout;
