import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/userContext";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const { User, setUser } = useContext(UserDataContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newUser = {
      email: email,
      password: password,
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );
      if (response.status === 201) {
        const data = response.data;

        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
    }

    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md flex flex-col items-center">
        <img className="w-20 mb-8" src="/images/Logo1.png" alt="Logo" />
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create an account
        </h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <h3 className="text-lg font-medium mb-2">Enter your Name</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                required
                id="firstName"
                className="bg-gray-100 rounded w-full px-4 py-2 mb-5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <input
                required
                id="lastName"
                className="bg-gray-100 rounded w-full px-4 py-2 mb-5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">Enter your Email</h3>
          <div>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="bg-gray-100 rounded px-4 py-2 mb-5 w-full text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              type="email"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Enter your Password</h3>
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
            Create Account
          </button>
          <div className="w-full">
            <p className="text-[10px]">
              By proceeding, you consent to get alerts, messages, calls,
              including by automated means from Parkify to the number provided{" "}
            </p>
          </div>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
