import Image from "next/image";
import { User } from "phosphor-react";
import React from "react";

function Comment() {
  return (
    <div className="campaign__comment">
      <div className="campaign__comment__icon">
        <User size={16} weight="bold" />
      </div>

      <div className="campaign__comment__details">
        <div className="campaign__comment__details-info">
          <p className="donator">Mark Tenenholtz</p>
          <p className="date">6h</p>
        </div>

        <p className="message">
          Lorem, ipsum dolor sit amet consectetur adipisicing. Lorem, ipsum
          dolor sit amet consectetur adipisicing elit. Labore voluptatibus
          impedit ipsa illo laboriosam ex commodi eum excepturi vel reiciendis
          placeat architecto tenetur id ullam nobis sunt, quia rerum debitis.
        </p>
      </div>
    </div>
  );
}

export default Comment;
