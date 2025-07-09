import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserProtectWrapper = ({
  children
}) => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserDataContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return;
    }

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        const user = response.data.user;
        if (
          user &&
          typeof user === "object" &&
          user._id &&
          typeof user._id === "string"
        ) {
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
          console.error("Invalid user object received from /users/profile:", user);
        }
      })
      .catch(err => {
        console.log(err)
        localStorage.removeItem('token')
        navigate('/login')
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token])

  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <>
      {children}
    </>
  )
}

export default UserProtectWrapper