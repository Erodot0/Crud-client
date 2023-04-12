import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

function Navbar() {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  //Removes the authentication token cookie when the user logs out.
  const handleLogout = () => {
    removeCookie("token", { path: "/" });
  };

  return (
    <nav className="navbar">
      <Link to={"/home/dashboard"} className="navbar__link">
        dashboard
      </Link>
      <Link to={"/home/blogs"} className="navbar__link">
        blogs
      </Link>
      <button className="navbar__link" onClick={handleLogout}>
        logout
      </button>
    </nav>
  );
}

export default Navbar;
