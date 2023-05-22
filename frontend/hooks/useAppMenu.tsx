"use client";

import { useState } from "react";
import { Menu, MenuItem } from "@szhsin/react-menu";

const useAppMenu = (defaultOption: any, items: any) => {
  const [activeOption, setActiveOption] = useState(defaultOption || items[0]);

  interface AppMenuProps {
    children: React.ReactNode;
  }

  const AppMenu = ({ children }: AppMenuProps) => {
    return (
      <div className="app-menu__container">
        <Menu
          align="end"
          transition
          menuButton={children as any}
          menuClassName="app-menu"
          onItemClick={e => setActiveOption(e.value)}
        >
          {items?.map((slug: any, index: number) => (
            <MenuItem
              data-active={slug === activeOption}
              value={slug}
              key={index}
              className="menu-item"
            >
              <p>{slug}</p>
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };

  return [AppMenu, activeOption];
};

export default useAppMenu;
