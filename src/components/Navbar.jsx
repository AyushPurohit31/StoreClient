import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Typography } from "@mui/material";
import '../index.css'
import axios from "axios";

const Navbar = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logoutHandler = async() =>{
    setLoading(true);
    try {
      // Make a request to the server to log out the user
      await axios.post('/logout');

      // Clear the saved cookies on the client-side
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem("userInfo");
      setLoading(false);
      navigate('/login')
      toast.success("Logged out successfully!")
    } catch (error) {
      setLoading(false);
      console.error('Error during logout:', error);
    }
  }

  return (
    <div className="md:text-[18px] flex flex-row justify-between h-14 items-center shadow-md border-b-2 rounded-b-[2px] px-[5%] bg-slate-300">
      <div>
          <p className="navbarCss text-3xl tracking-widest">
            {userInfo.name}
          </p>
      </div>
      <div>
        <ul className="flex flex-row gap-5">
          <li>
            <Link to='/store'>
              <p className="navbarCss">
                Store
              </p>
            </Link>
          </li>
          <li>
            <Link to='/bills'>
              <p className="navbarCss">
                Bills
              </p>
            </Link>
          </li>
          <li>
            <Link>
              <p onClick={logoutHandler} className="navbarCss">
                Logout
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;