"use client";

import Icons from "../Icons";
import Link from "next/link";
import Image from "next/image";
import ActiveLink from "../ActiveLink";
import {
  User,
  Ticket,
  CreditCard,
  FadersHorizontal,
  Megaphone,
  MapTrifold,
  BellSimple,
  Bell,
  UserCircle,
  ArrowUpRight,
  GithubLogo,
} from "phosphor-react";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <h1>Coinfunds</h1>
      </div>

      <div className="sidebar__menu">
        <ul>
          {[
            {
              name: "Donations",
              link: "/",
              altLink: "/donations",
              icon: (
                <Icons.HandCoins
                  size={20}
                  className="sidebar__menu-item-icon"
                />
              ),
            },
            {
              name: "Campaigns",
              link: "/campaigns",
              icon: (
                <Megaphone
                  size={20}
                  mirrored
                  weight="fill"
                  className="sidebar__menu-item-icon"
                />
              ),
            },
            {
              name: "Cards",
              link: "/cards",
              icon: (
                <CreditCard
                  size={20}
                  weight="fill"
                  className="sidebar__menu-item-icon"
                />
              ),
            },
            // {
            //   name: "Profile",
            //   link: "/profile",
            //   icon: (
            //     <UserCircle
            //       size={20}
            //       weight="fill"
            //       className="sidebar__menu-item-icon"
            //     />
            //   ),
            // },
            {
              name: "Updates",
              link: "/updates",
              icon: (
                <Bell
                  size={19}
                  weight="fill"
                  className="sidebar__menu-item-icon"
                />
              ),
            },
          ].map((item, index) => {
            return (
              <li key={index}>
                <ActiveLink
                  href={item?.link + ""}
                  altLink={item?.altLink + ""}
                  className="sidebar__menu-item"
                  activeClassName="sidebar__menu-item--active"
                >
                  {item?.icon}
                  <p>{item?.name}</p>
                </ActiveLink>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar__footer">
        <ul>
          <li>
            <ActiveLink
              href="/profile"
              className="profile-link"
              activeClassName="profile-link--active"
            >
              <Image
                width={100}
                height={100}
                alt="Display Picture"
                src="https://images.unsplash.com/photo-1642365585811-17521651de66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXwxMjA0ODU2Mnx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60"
                className="sidebar__menu-item-icon"
              />

              <div className="username">
                <p>Ringloper</p>
              </div>
            </ActiveLink>
            <div className="bottom-line" />
          </li>
          <li>
            <Link href="https://github.com/codergon" target="_blank">
              <Icons.GitHub size={19} />
              <p>Github</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
