import Card from "@/components/cards/Card";

function Page() {
  return (
    <div className="connected-cards">
      {[0, 1].map((item, index) => {
        return <Card key={index} colorsIndex={item} />;
      })}
    </div>
  );
}

export default Page;
