import {
  FaUsers,
  FaUserCheck,
  FaMoneyBillWave,
  FaCalendarCheck,
} from "react-icons/fa";

const cards = [
  {
    title: "Total Employees",
    value: "245",
    color: "#4F46E5",
    icon: <FaUsers />,
  },
  {
    title: "Present Today",
    value: "228",
    color: "#16A34A",
    icon: <FaUserCheck />,
  },
  {
    title: "Payroll",
    value: "$42,580",
    color: "#F59E0B",
    icon: <FaMoneyBillWave />,
  },
  {
    title: "Attendance",
    value: "93%",
    color: "#DC2626",
    icon: <FaCalendarCheck />,
  },
];

const DashboardCards = () => {
  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => (
        <div className="dashboard-card" key={index}>
          <div
            className="dashboard-card-icon"
            style={{ background: card.color }}
          >
            {card.icon}
          </div>

          <div>
            <h3>{card.value}</h3>
            <p>{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;