import Card from "../../components/Card/Card";

const DashboardCards = () => {
  const cards = [
    { title: "Total Employees", value: 250 },
    { title: "Present Today", value: 220 },
    { title: "On Leave", value: 18 },
    { title: "Departments", value: 8 },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          value={card.value}
        />
      ))}
    </div>
  );
};

export default DashboardCards;