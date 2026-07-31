import "../../styles/login.css";
const Login = () => {
  return (
    <div className="login-container">

      <div className="login-card">

        <h2>HRMS Login</h2>

        <input type="email" placeholder="Email" />

        <input type="password" placeholder="Password" />

        <button>Login</button>

      </div>

    </div>
  );
};

export default Login;