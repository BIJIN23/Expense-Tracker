import { useEffect, useState } from "react";
import { apiRequest, setUnauthorizedHandler } from "./api/api";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [checkingAuth, setCheckingAuth] = useState(true);
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setPage("login");
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  useEffect(() => {
    apiRequest("/auth/me")
      .then((res) => {
        setUser(res.user);
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    apiRequest("/auth/logout", { method: "post" })
      .then(() => {
        setUser(null);
        setPage("login");
      })
      .catch((err) => {
        console.error("Logout failed:", err.message);
      });
  }

  if (checkingAuth) {
    return <p>Checking Authentication.... </p>;
  }
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }
  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="brand">
          <div className="brand-icon">₹</div>
          <h1>ExpenseFlow</h1>
          <p>Take control of your finances.</p>
        </div>

        <div className="auth-card">
          {page === "login" ? <Login onLogin={handleLogin} /> : <Register />}

          <div className="auth-switch">
            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  current === "login" ? "register" : "login",
                )
              }
            >
              {page === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
