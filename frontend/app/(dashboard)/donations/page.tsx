"use client";

import millify from "millify";
import Image from "next/image";
import TimeAgo from "react-time-ago";
import { ArrowsVertical, CreditCard } from "phosphor-react";

import TimeAgoy from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useEffect, useState } from "react";

TimeAgoy.addDefaultLocale(en);

interface PageProps {
  children?: React.ReactNode;
}

function DonationsTable({}: PageProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <div className="app-table">
        <div className="app-table__row app-table__row__header">
          <div className="app-table__row__item">
            <div className="app-table__row__item-content">
              <p>User</p>
              <ArrowsVertical />
            </div>
          </div>
          <div className="app-table__row__item">
            <div className="app-table__row__item-content">
              <p>Card</p>
              <ArrowsVertical />
            </div>
          </div>
          <div className="app-table__row__item">
            <div className="app-table__row__item-content">
              <p>Type</p>
              <ArrowsVertical />
            </div>
          </div>
          <div className="app-table__row__item">
            <div className="app-table__row__item-content">
              <p>Amount</p>
              <ArrowsVertical />
            </div>
          </div>
          <div className="app-table__row__item">
            <div className="app-table__row__item-content">
              <p>Date</p>
              <ArrowsVertical />
            </div>
          </div>
          <div className="app-table__row__item">
            <div className="app-table__row__item-content">
              <p>Category</p>
              <ArrowsVertical />
            </div>
          </div>
          <div className="app-table__row__item">
            <div className="app-table__row__item-content">
              <p>Reference</p>
              <ArrowsVertical />
            </div>
          </div>
        </div>

        {/*  */}

        {[
          {
            id: 1,
            user: {
              name: "Alyssa Jackson",
              avatar: "https://i.pravatar.cc/300",
            },
            card: 5627,
            type: "Visa",
            amount: 3698.7,
            category: "Technology",
            reference: "IXY-R23-UY8E",
            date: Date.now() - 1000000,
          },
          {
            id: 2,
            user: {
              name: "Pamela Washington",
              avatar: "https://i.pravatar.cc/300",
            },
            card: 6821,
            type: "Mastercard",
            amount: 456789.7,
            date: Date.now() - 10000000,
            category: "Education",
            reference: "GYR-4T3-71HU",
          },
          {
            id: 3,
            user: {
              name: "Hannah King",
              avatar: "https://i.pravatar.cc/300",
            },
            card: 4127,
            type: "Visa",
            amount: 456789.7,
            date: Date.now() - 100000000,
            category: "Health",
            reference: "LM5-Z43-91PA",
          },
        ].map((donation, index) => {
          return (
            <div key={donation.id} className="app-table__row">
              <div className="app-table__row__item">
                <div className="app-table__row__item-image">
                  <Image
                    src={donation.user.avatar}
                    alt={donation.user.name}
                    width={30}
                    height={30}
                  />
                </div>
                <p className="value">{donation.user.name}</p>
              </div>
              <div className="app-table__row__item">
                <p className="value">{donation.card}</p>
              </div>
              <div className="app-table__row__item">
                <CreditCard size={15} />
                <p className="value">{donation.type}</p>
              </div>
              <div className="app-table__row__item">
                <p className="value">
                  {"$" +
                    millify(donation.amount, {
                      precision: 2,
                    })}
                </p>
              </div>
              <div className="app-table__row__item">
                <p className="value">
                  {/* {dayjs(donation.date).format("DD/MM/YYYY")} */}
                  {loaded && <TimeAgo date={donation.date} timeStyle="round" />}
                </p>
              </div>
              <div className="app-table__row__item">
                <p className="value category">{donation.category}</p>
              </div>
              <div className="app-table__row__item">
                <p className="value">{donation.reference}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DonationsTable;
