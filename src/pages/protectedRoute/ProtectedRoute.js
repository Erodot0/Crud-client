import React from "react";
import { Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import LoginForm from "../login/login";

const ProtectedRoute = ({ component: Component, ...props }) => {
  const [cookies] = useCookies(["token"]);

  return cookies.token ? <Outlet /> : <LoginForm />
};

export default ProtectedRoute;
