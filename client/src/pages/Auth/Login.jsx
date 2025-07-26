import { useNavigate } from "react-router-dom";

import instance from "../../api/axios";

const Login = () => {

  const [username, password] = ["", ""];
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await instance.post("/api/v1/auth/login", {
        username,
        password,
      });

      const user = res.data.user;
      // Optional: dispatch to redux store here

      // ✅ Role-based redirection
      if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    // Your form JSX
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
