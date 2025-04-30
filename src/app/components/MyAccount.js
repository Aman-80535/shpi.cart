'use client'

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/user/userActions";
import nextConfig from "../../../next.config.mjs";
import { simpleNotify } from "@/utils/common";

export const MyAccount = () => {
  const dispatch = useDispatch();
  const { isLoading, error, userData } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    simpleNotify('Logout successfully!')
    localStorage.removeItem("user_uid");
    // navigate("/login")
  };

  return (
    <div classNameName="container" style={{ textAlign: "-webkit-center", }}>
      <p>My Account</p>
      <div className="card" style={{
        height: "420px",
        border: "solid dimgray",
        borderRadius: "29px",
        size: "34px",
        width: "50%", width: "40rem",
        fontSize: "13px"
      }}>
        <div className="card-body">
          <p><b>Created By:</b></p>
          <img src="https://avatars.githubusercontent.com/u/90741749?v=4" alt="" style={{
            border: "1px solid",
            borderRadius: "117px"
          }} />
          <h5 className="card-title">{userData?.firstName + userData?.lastName}</h5>
          <button className="btn-primary" onClick={handleLogout} style={{   borderRadius: "44px" }}>Logout</button>
        </div>
      </div>
    </div>
  )
}