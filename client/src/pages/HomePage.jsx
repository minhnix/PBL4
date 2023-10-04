import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
const HomePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <input
        type="button"
        value="Log out"
        onClick={() => {
          logout();
          navigate("/signin");
        }}
      />
    </div>
  );
};

export default HomePage;
