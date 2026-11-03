import { useState } from "react";
import { apiRequest } from "../api/api";
export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleEmail(e) {
    setEmail(e.target.value);
  }
  function handlePaswword(e) {
    setPassword(e.target.value);
  }
  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    apiRequest("/auth/login", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <form>
      <h2> Login</h2>
      <label>Email ID</label>
      <input
        type="email"
        placeholder="Example@gmail.com"
        onChange={handleEmail}
        required
      ></input>
      <label> Password</label>
      <input
        type="password"
        onChange={handlePaswword}
        required
        value={password}
      ></input>
      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}
      <button type="submit" onSubmit={handleSubmit} disabled={loading}>
        {" "}
        Submit
      </button>
    </form>
  );
}
