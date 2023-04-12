import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  // Initialize state variables
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [cookies, setCookie] = useCookies(["token"]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the server with the login credentials
      const response = await axios.post(
        "http://localhost:5000/login",
        credentials
      );
      // If the login is successful, store the token in cookies and redirect to the home page
      setCookie("token", response.data.token, { path: "/" });
      setError(null);
      setCredentials({ email: "", password: "" });
      navigate("/home");
    } catch (err) {
      // If an error occurs, display an error message to the user
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    }
  };

  // closes the error popup
  if (error) {
    setTimeout(() => {
      setError(null);
    }, 2000);
  }

  // If the user is already logged in, redirect to the home page
  useEffect(() => {
    if (cookies.token) {
      navigate("/home");
    }
  }, [cookies.token, navigate]);

  return (
    <div className="wrapper">
      {error && <div className="error-message">{error}</div>}
      <form className="form section__wrapper" onSubmit={handleSubmit}>
        <h1 className="form-title">Login</h1>
        <div className="form-field">
          <label className="form-field__label" htmlFor="email">
            Email
          </label>
          <input
            className="form-field__input"
            type="text"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-field">
          <label className="form-field__label" htmlFor="password">
            Password
          </label>
          <input
            className="form-field__input"
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
          />
        </div>
        <button className="form-button" type="submit">
          Login
        </button>
        <Link className="form-link" to={"/register"}>
          click here to register
        </Link>
      </form>
    </div>
  );
};

export default LoginForm;
