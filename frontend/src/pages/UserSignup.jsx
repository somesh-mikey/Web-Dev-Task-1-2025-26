import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/userContext'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userData, setUserData] = useState({})

  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/register`, newUser)

    if (response.status === 201) {
      const data = response.data;
      const user = data.user;
      if (
        user &&
        typeof user === "object" &&
        user._id &&
        typeof user._id === "string"
      ) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        localStorage.removeItem("user");
        setUser(null);
        console.error("Invalid user object received:", user);
      }
    }

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
  }

  return (
    <div className="py-5 px-5 h-screen flex flex-col justify-between">
      <div>
        <img className="w-20 mb-3" src="/images/Logo1.png" alt="" />
        <form onSubmit={submitHandler}>
          <h3 className="text-lg w-full font-medium mb-2">What's your name</h3>
          <div className="flex gap-4 mb-7">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <h3 className="text-lg font-medium mb-2">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-lg font-medium mb-2">Enter Password</h3>
          <input
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required type="password"
            placeholder="password"
          />
          <button
            className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
          >Create account</button>
        </form>
        <p className="text-center">Already have a account? <Link to="/login" className="text-blue-600">Login here</Link></p>
      </div>
      <div>
        <p className="text-[10px] mt-6 leading-tight">This site is protected by reCAPTCHA and the <span className="underline">Google Privacy
          Policy</span> and <span className="underline">Terms of Service apply</span>.</p>
      </div>
    </div>
  )
}

export default UserSignup