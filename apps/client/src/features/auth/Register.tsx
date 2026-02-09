import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../../lib/api";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await api.post("/api/v1/auth/register", {
        name,
        email,
        password,
      });
      toast.success("Account created");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6">Create account</h1>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-slate-700"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-slate-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-slate-700"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-600 py-2 rounded font-medium"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="mt-4 text-sm text-center text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
