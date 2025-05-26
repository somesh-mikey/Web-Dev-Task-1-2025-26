import { useState } from "react";
import { Link } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Add login logic here
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md flex flex-col items-center">
        <img className="w-20 mb-8" src="/images/Logo1.png" alt="Logo" />
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Sign in to your account
        </h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 mb-1 text-sm" htmlFor="email">
              Email Address
            </label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="bg-gray-100 rounded px-4 py-2 w-full text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              type="email"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 mb-1 text-sm"
              htmlFor="password"
            >
              Password
            </label>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              className="bg-gray-100 rounded px-4 py-2 w-full text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              type="password"
              placeholder="password"
            />
          </div>
          <button
            type="submit"
            className="bg-[#111] hover:bg-[#222] text-white rounded px-4 py-2 w-full text-lg font-semibold transition"
          >
            Login
          </button>
          <div className="w-full">
            <Link
              to="/captain-login"
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 w-full text-lg font-semibold transition"
            >
              Sign in as Captain
            </Link>
          </div>
        </form>
        <p className="text-center mt-4 text-sm">
          New here?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create new Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
