import Comment from "./Comment";

function Comments() {
  return (
    <div className="campaign__comments">
      <div className="campaign__comments-header">
        <h3>Supportive Sentiments</h3>
      </div>

      {[
        {
          name: "Linda Johnson",
          date: "6h",
          message:
            "I'm so happy to be able to help and I hope you reach your goal!",
        },
        {
          name: "Randy Fisher",
          date: "1d",
          message: "It's not much, but I hope it helps!",
        },
        {
          name: "Donbaki Johnson",
          date: "2d",
          message: "We're all in this together!",
        },
      ].map((item, index) => {
        return <Comment key={index} comment={item} />;
      })}
    </div>
  );
}

export default Comments;
