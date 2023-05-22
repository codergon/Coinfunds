import Comment from "./Comment";

function Comments() {
  return (
    <div className="campaign__comments">
      <div className="campaign__comments-header">
        <h3>Supportive Sentiments</h3>
      </div>

      {[1, 2, 3].map((item, index) => {
        return <Comment key={index} />;
      })}
    </div>
  );
}

export default Comments;
