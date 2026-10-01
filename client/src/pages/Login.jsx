import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >
        <h1>TaskFlow</h1>

        <h2>Welcome back</h2>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Signing in..."
            : "Sign In"}
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Create account
          </Link>
        </p>

      </form>

    </div>
  );
};

export default Login;