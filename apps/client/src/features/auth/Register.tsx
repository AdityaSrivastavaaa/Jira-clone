import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6">Create account</h1>

        <input
          placeholder="Name"
          className="w-full mb-4 px-4 py-2 rounded bg-slate-700"
        />
        <input
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 rounded bg-slate-700"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 rounded bg-slate-700"
        />

        <button className="w-full bg-green-600 py-2 rounded font-medium">
          Register
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
