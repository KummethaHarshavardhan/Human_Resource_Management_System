import "./Modal.css";

const Modal = ({ title, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;