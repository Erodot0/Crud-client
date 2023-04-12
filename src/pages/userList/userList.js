import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../reusable/nav";
import { useCookies } from "react-cookie";

function UserList() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [Cookies] = useCookies(["token"]);
  const port = 5000;

  // Fetches user data from the server
  async function loadData() {
    try {
      const res = await axios.get(`http://localhost:${port}/api/user/get`, {
        headers: { Authorization: `Bearer ${Cookies.token}` },
      });
      setRole(res.data.role);
      setData(res.data.result);
    } catch (error) {
      // Sends appropriate error response to the client
      setError(`Failed to load users`);
    }
  }

  // Deletes a user from the server
  function deleteUser(id) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`http://localhost:${port}/api/user/remove/${id}`, {
          headers: { Authorization: `Bearer ${Cookies.token}` },
        })
        .then(() => {
          loadData(); // Reloads the data after the user is deleted
        })
        .catch((error) => {
          // Sends appropriate error response to the client
          console.log(error)
          setError(`Failed to delete user`);
        });
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // closes the error popup
  if (error) {
    setTimeout(() => {
      setError(null);
    }, 2000);
  }

  return (
    <div className="wrapper">
      <Navbar />
      {error && <div className="error-message">{error}</div>}
      <div className="section__wrapper">
        <div className="users">
          <h1 className="users__title">Users</h1>
          <table className="users__table">
            <thead className="users__table-head">
              <tr>
                <td className="users__table-head-item">N</td>
                <td className="users__table-head-item">Name</td>
                <td className="users__table-head-item">Email</td>
                <td className="users__table-head-item">Password</td>
                <td className="users__table-head-item">Position</td>
                <td className="users__table-head-item"></td>
              </tr>
            </thead>
            <tbody className="users__table-body">
              {data.map((info, index) => {
                return (
                  <tr key={info + index} className="users__table-row users__table-body-row">
                    <td className="row__item">{index + 1}</td>
                    <td className="row__item">{info.name}</td>
                    <td className="row__item">{info.email}</td>
                    <td className="row__item">{info.password}</td>
                    <td className="row__item">{info.user_role}</td>
                    <td className="row__item">
                      {role !== "Admin" && (
                        <Link
                          to={`/home/users/update/${info.Id}`}
                          className="users__table-link"
                        >
                          Edit
                        </Link>
                      )}
                      {role !== "Admin" && (
                        <button
                          onClick={() => deleteUser(info.Id)}
                          className="users__table-button"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button onClick={() => navigate("/home/dashboard")} className="back-button">
          Back
        </button>
      </div>
    </div>
  );
}

export default UserList;
