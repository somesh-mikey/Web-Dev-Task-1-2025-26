import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState({});

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { Captain, setCaptain } = React.useContext(CaptainDataContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const captainData = {
      email: email,
      password: password,
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/captains/register`,
      captainData
    );

    if (response.status === 201) {
      const data = response.data;
      setCaptain(data.captain);
      localStorage.setItem("token", data.token);
      navigate("/captain-home");
    }

    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md flex flex-col items-center">
        <img className="w-20 mb-8" src="/images/Logo1.png" alt="Logo" />
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create a Captain account
        </h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium mb-2">Enter your Name</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  required
                  id="firstName"
                  className="bg-white rounded-md w-full px-4 py-2 mb-5 text-base border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
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
                  className="bg-white rounded-md w-full px-4 py-2 mb-5 text-base border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
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
                className="bg-white rounded-md px-4 py-2 mb-5 w-full text-base border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
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
                className="bg-white rounded-md px-4 py-2 w-full text-base border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                type="password"
                placeholder="password"
              />
            </div>

            <div className="mt-6"></div>
            <h3 className="text-lg font-medium mb-2">Vehicle Details</h3>
            <div className="flex gap-1 mb-4">
              <input
                required
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                className="bg-white rounded-md flex-1 px-0 py-2 text-base border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                type="text"
                placeholder="Vehicle Color"
              />
              <input
                required
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                className="bg-white rounded-md flex-1 px-4 py-2 text-base border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                type="text"
                placeholder="Vehicle Plate Number"
              />
            </div>
            <div className="flex gap-4">
              <select
                required
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="bg-white rounded-md flex-1 px-0.5 py-2 text-base border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="">Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="motorcycle">Two-Wheeler</option>
                <option value="three-wheeler">Three-Wheeler</option>
              </select>
              <input
                required
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                className="bg-white rounded-md flex-1 px-4 py-2 text-base border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                type="number"
                min="1"
                placeholder="Vehicle Capacity"
              />
            </div>

            <button
              type="submit"
              className="bg-[#111] hover:bg-[#222] text-white rounded px-4 py-2 w-full text-lg font-semibold transition"
            >
              Create Captain Account
            </button>
            <div className="w-full">
              <p className="text-[10px]">
                By proceeding, you consent to get alerts, messages, calls,
                including by automated means from Parkify to the number provided{" "}
              </p>
            </div>
          </div>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
