import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

// Define initial state of form inputs
const initialState = {
  name: "",
  email: "",
  password: "",
};

const RegisterUser = () => {
  // Use state hooks to manage component state
  const [state, setState] = useState(initialState);
  const [error, setError] = useState(null);
  const [cookies, setCookie] = useCookies(["token"]);
  const { name, email, password } = state;
  const navigate = useNavigate();

  // Define port for API calls
  const port = 5000;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled out
    if (!name || !email || !password) {
      setError("Please fill all the required fields.");
      return;
    }

    try {
      // Make API call to register user with form data
      const response = await axios.post(
        `http://localhost:${port}/api/user/post/`,
        {
          name,
          email,
          password,
        }
      );

      // Save user token in cookies and reset form state
      setCookie("token", response.data.token, { path: "/" });
      setState(initialState);

      // Navigate to home page
      navigate("/home");
    } catch (err) {
      // Handle errors by setting error state to error message from server
      setError(err.response?.data?.message ?? "An error occurred.");
    }
  };

  // Handle input changes by updating corresponding state property
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  return (
    <div className="wrapper">
      {error && <div className="error-message">{error}</div>}
      <form className="form section__wrapper" onSubmit={handleSubmit}>
        <h1 className="form-title">Register</h1>
        <div className="form-field">
          <label htmlFor="name" className="form-field__label">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="form-field__input"
            value={name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email" className="form-field__label">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-field__input"
            value={email}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="password" className="form-field__label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-field__input"
            value={password}
            onChange={handleInputChange}
          />
        </div>

        <input type="submit" value="Register" className="form-button" />
        <Link to={"/login"} className="form-link">
          click here to login
        </Link>
      </form>
    </div>
  );
};

export default RegisterUser;
