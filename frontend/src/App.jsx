import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import Captainlogin from "./pages/Captainlogin";
import UserSignup from "./pages/UserSignup";
import CaptainSignup from "./pages/CaptainSignup";
import { UserDataContext } from "./context/userContext";
import UserLogout from "./pages/UserLogout";
import Home from "./pages/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectWrapper from "./pages/CaptainProtectWrapper";
import CaptainLogout from "./pages/CaptainLogout";
import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import "remixicon/fonts/remixicon.css";

const App = () => {
  const ans = useContext(UserDataContext);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/riding" element={<Riding />} />
        <Route path="/captain-riding" element={<CaptainRiding />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/captain-login" element={<Captainlogin />} />
        <Route path="/captain-signup" element={<CaptainSignup />} />
        <Route
          path="/home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />

        <Route
          path="/user/logout"
          element={
            <UserProtectedWrapper>
              <UserLogout></UserLogout>
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/captain-home"
          element={
            <CaptainProtectWrapper>
              <CaptainHome>
                <div>Captain Home</div>
              </CaptainHome>
            </CaptainProtectWrapper>
          }
        />
        <Route
          path="/captain/logout"
          element={
            <CaptainProtectWrapper>
              <CaptainLogout />
            </CaptainProtectWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
