import Navbar from "../reusable/nav";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

/**
 * The Dashboard component displays the user's profile information, including their email,
 * password, and role. If the user is not a Guest, they will also have the option to add
 * blogs and view a list of users.
 */
function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [cookies] = useCookies(["token"]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/view/",
          {
            headers: { Authorization: `Bearer ${cookies.token}` },
          }
        );
        setUserData(response.data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Something went wrong. Please try again later."
        );
      }
    };
    fetchUserData();
  }, [cookies.token]);

  // closes the error popup
  if (error) {
    setTimeout(() => {
      setError(null);
    }, 2000);
  }

  // If the user data is still being fetched, display a loading message
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wrapper">
      <Navbar />
      {error && <div className="error-message">{error}</div>}
      <div className="profile section__wrapper">
        <h1 className="profile__heading">My Profile</h1>
        <p className="profile__email">Email: {userData.email}</p>
        <p className="profile__password">Password: {userData.password}</p>
        <p className="profile__role">Role: {userData.user_role}</p>
        <div className="profile__links">
          {userData.user_role !== "Guest" && (
            <Link
              className="profile__link profile__link--add-blogs"
              to={"/home/blogs/add"}
            >
              Add blogs
            </Link>
          )}
          {userData.user_role !== "Guest" && (
            <Link
              className="profile__link profile__link--users"
              to={"/home/users"}
            >
              Users
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
