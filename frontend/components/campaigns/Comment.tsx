import React from "react";
import { User } from "phosphor-react";

interface CommentProps {
  comment: {
    name: string;
    message: string;
    date: string;
  };
}

function Comment({ comment }: CommentProps) {
  return (
    <div className="campaign__comment">
      <div className="campaign__comment__icon">
        <User size={16} weight="bold" />
      </div>

      <div className="campaign__comment__details">
        <div className="campaign__comment__details-info">
          <p className="donator">{comment.name}</p>
          <p className="date">{comment.date}</p>
        </div>

        <p className="message">{comment.message}</p>
      </div>
    </div>
  );
}

export default Comment;
