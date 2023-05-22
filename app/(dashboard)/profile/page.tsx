"use client";

import { capitalizeFirst } from "@/utils/text";
import dayjs from "dayjs";
import ReactTimeAgo from "react-time-ago";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);

function page() {
  interface UserData {
    id: string;
    username: string;
    email: string;
    dateCreated: string;
    region?: string;
  }

  const userdata: UserData = {
    id: "1",
    username: "Ringloper",
    email: "greatguy45@gmail.com",
    dateCreated: "1682982000000",
    region: "Netherlands",
  };

  return (
    <div className="user-details">
      <div className="user-details__header">
        <h1 className="user-details__title">Account Overview</h1>
      </div>

      {Object.keys(userdata).map(key => {
        return (
          !["id"].includes(key) && (
            <div key={key} className="user-details__row">
              <h3 className="label">
                {capitalizeFirst(
                  key
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .toLowerCase()
                )}
              </h3>
              <h3 className="value">
                {key === "dateCreated" ? (
                  <>
                    {dayjs(Number(userdata[key as keyof UserData])).format(
                      "DD/MM/YYYY"
                    )}
                    <span>
                      (
                      <ReactTimeAgo
                        date={Number(userdata[key as keyof UserData])}
                      />
                      )
                    </span>
                  </>
                ) : (
                  userdata[key as keyof UserData]
                )}
              </h3>
            </div>
          )
        );
      })}

      <div className="user-details__actions">
        <button className="c-button">
          <span>Change Password</span>
        </button>
        <button className="c-button c-button--dark">
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default page;
