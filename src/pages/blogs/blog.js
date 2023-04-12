import React, { useState, useEffect } from "react";
import Navbar from "../reusable/nav";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

function Blogs() {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("Guest");
  const [error, setError] = useState(null);
  const [cookies] = useCookies();
  const port = 5000;

  // Fetch data
  async function loadData() {
    try {
      const res = await axios.get(`http://localhost:${port}/api/blog/get`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setRole(res.data.role);
      setData(res.data.result);
    } catch (error) {
      // Sends appropriate error response to the client
      setError(`Failed to load data`);
    }
  }

  function deleteBlog(Id) {
    if (window.confirm("Are you sure you want to delete it?")) {
      axios
        .delete(`http://localhost:${port}/api/blog/remove/${Id}`, {
          headers: { Authorization: `Bearer ${cookies.token}` },
        })
        .then(() => {
          // Reload data after successful delete
          loadData();
        })
        .catch((error) => {
          // Sends appropriate error response to the client
          setError(`Failed to delete blog`);
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
      <div className="blog__wrapper">
        {data.map((info, index) => {
          return (
            <div key={info + index} className="blog section__wrapper">
              <h2 className="blog__title">{info.blog_title}</h2>
              <p className="blog__desc">{info.blog_desc}</p>
              <div className="blog__actions">
                {role !== "Guest" ? (
                  <Link
                    to={`/home/blog/update/${info.Id}`}
                    className="blog__actions--edit-link"
                  >
                    Edit
                  </Link>
                ) : null}
                {role !== "Guest" ? (
                  <button
                    onClick={() => deleteBlog(info.Id)}
                    className="blog__actions--delete-button"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Blogs;
