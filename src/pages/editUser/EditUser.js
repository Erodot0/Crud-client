import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const initialState = {
  name: "",
  email: "",
  password: "",
  user_role: "",
};

function AddEdit() {
  const [error, setError] = useState(null);
  const [state, setState] = useState(initialState);
  const { name, email, password, user_role } = state;
  const [Cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const params = useParams();
  const id = params.Id;
  const port = 5000;

  // Fetch the user data to prepopulate the form
  useEffect(() => {
    axios
      .get(`http://localhost:${port}/api/user/get/${id}`, {
        headers: { Authorization: `Bearer ${Cookies.token}` },
      })
      .then((res) => setState({ ...res.data[0] }))
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch user data");
      });
  }, [id, Cookies.token, port]);

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password || !user_role) {
      setError("Please fill in all fields");
    } else {
      axios
        .put(
          `http://localhost:${port}/api/user/update/${id}`,
          {
            name,
            email,
            password,
            user_role,
          },
          {
            headers: { Authorization: `Bearer ${Cookies.token}` },
          }
        )
        .then(() => {
          setState(initialState);
          navigate("/home/users");
        })
        .catch((err) => {
          console.log(err);
          setError("Failed to update user");
        });
    }
  }

  // Handle form input changes
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
      {error && <div className="error-message">{error}</div>}

      <form className="section__wrapper form" action="" onSubmit={handleSubmit}>
        <h1 className="form-title">Edit User</h1>
        <div className="form-field">
          <label className="form-field__label" htmlFor="name">
            Name
          </label>
          <input
            className="form-field__input"
            type="text"
            name="name"
            id="name"
            placeholder="write your name"
            value={name || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label className="form-field__label" htmlFor="email">
            email
          </label>
          <input
            className="form-field__input"
            type="email"
            name="email"
            id="email"
            value={email || ""}
            placeholder="write your email"
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label className="form-field__label" htmlFor="password">
            password
          </label>
          <input
            className="form-field__input"
            type="password"
            name="password"
            id="password"
            value={password || ""}
            placeholder="write your password"
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <div className="form-radio">
            <label className="form-field__label" htmlFor="user_owner">
              Owner
            </label>
            <input
              className="form-field__radio"
              type="radio"
              name="user_role"
              id="user_owner"
              value="Owner"
              checked={user_role === "Owner" ? true : false}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-radio">
            <label className="form-field__label" htmlFor="user_Admin">
              Admin
            </label>
            <input
              className="form-field__radio"
              type="radio"
              name="user_role"
              id="user_Admin"
              value="Admin"
              checked={user_role === "Admin" ? true : false}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-radio">
            <label className="form-field__label" htmlFor="user_guest">
              Guest
            </label>
            <input
              className="form-field__radio"
              type="radio"
              name="user_role"
              id="user_guest"
              value="Guest"
              checked={user_role === "Guest" ? true : false}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <input
          className="form-button"
          type="submit"
          value={id ? "update" : "Save"}
        />
        <Link className="form-link" to={"/home/users"}>
          back
        </Link>
      </form>
    </div>
  );
}

export default AddEdit;
