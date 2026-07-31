import "../../styles/button.css";

const Button = ({ text, onClick, type = "button" }) => {
  return (
    <button className="custom-btn" type={type} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;