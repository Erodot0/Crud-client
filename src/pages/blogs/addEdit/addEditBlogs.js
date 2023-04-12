import React, { useEffect, useState } from "react";
import Navbar from "../../reusable/nav";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const initialState = {
  blog_title: "",
  blog_desc: "",
};

function AddEditBlog() {
  // Use hooks to manage component state and cookies
  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [error, setError] = useState(null);
  const { blog_title, blog_desc } = state;
  const [cookies] = useCookies(["token"]);

  // Extract the blog ID from the URL parameters
  const { Id } = useParams();

  // Fetch the blog data from the server if the ID is specified
  useEffect(() => {
    if (Id) {
      axios
        .get(`http://localhost:5000/api/blog/get/${Id}`, {
          headers: { Authorization: `Bearer ${cookies.token}` }, // Pass token in the headers
        })
        .then((res) => {
          if (res.data && res.data.length) {
            setState({ ...res.data[0] });
          } else {
            setError("No blog found");
          }
        })
        .catch((err) => {
          setError("Failed to load blog");
        });
    }
  }, [cookies.token, Id, navigate]);

  // Handle form submission
  function handleForm(e) {
    e.preventDefault();
    if (!blog_title || !blog_desc) {
      console.log("Fill in all required fields");
    } else {
      const endpoint = Id
        ? `http://localhost:5000/api/blog/update/${Id}`
        : "http://localhost:5000/api/blog/post";

      const method = Id ? "PUT" : "POST";

      axios({
        method,
        url: endpoint,
        headers: { Authorization: `Bearer ${cookies.token}` },
        data: { blog_title, blog_desc },
      })
        .then(() => {
          setState(initialState);
          navigate("/home/blogs");
        })
        .catch((err) => {
          setError(err?.response.data.message);
        });
    }
  }

  // Handle changes to the input fields
  function handleInputChange(e) {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  }

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
      <form className="form section__wrapper" action="" onSubmit={handleForm}>
        <h1 className="form-title">Blog Editor</h1>
        <div className="form-field">
          <label htmlFor="blog_title" className="form-field__label">
            Title
          </label>
          <input
            className="form-field__input"
            type="text"
            name="blog_title"
            id="blog_title"
            value={blog_title || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="blog_desc" className="form-field__label">
            Description
          </label>
          <textarea
            className="form-field__input"
            name="blog_desc"
            id="blog_desc"
            cols="30"
            rows="10"
            value={blog_desc || ""}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <input
          className="form-button"
          type="submit"
          value={Id ? "update" : "save"}
        />

        <button className="form-link" onClick={() => navigate(-1)}>
          back
        </button>
      </form>
    </div>
  );
}

export default AddEditBlog;
