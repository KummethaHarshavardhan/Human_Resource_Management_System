import "../../styles/input.css";

const Input = ({ type, placeholder }) => {
  return (
    <input
      className="custom-input"
      type={type}
      placeholder={placeholder}
    />
  );
};

export default Input;