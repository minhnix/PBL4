import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";

const AuthContext = createContext();

function AuthProvider(props) {
  const [token, setToken] = useState(localStorage?.getItem("token") || "");

  const [user, setUser] = useState(
    localStorage.getItem("token")
      ? jwtDecode(localStorage.getItem("token")).user
      : {}
  );

  const login = async (username, password) => {
    const body = {
      usernameOrEmail: username,
      password,
    };
    const res = await axios.post(
      "http://localhost:8080/api/v1/auth/login",
      body
    );
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  const setState = (token) => {
    setToken(token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const value = {
    token,
    user,
    login,
    logout,
    setState,
  };

  return <AuthContext.Provider value={value} {...props}></AuthContext.Provider>;
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (typeof context === "undefined")
    throw new Error("Something went wrong with the AuthProvide");
  return context;
};

export { AuthProvider, useAuth };
