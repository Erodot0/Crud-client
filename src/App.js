import "./style/main_style/style.css"
import "./style/form_style/form.css"
import "./style/nav_style/nav.css"
import "./style/profile_style/profile.css"
import "./style/userlist_style/userlist.css"
import "./style/blog_style/blog.css"

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import AddEdit from "./pages/editUser/EditUser";
import UserList from "./pages/userList/userList";
import Blogs from "./pages/blogs/blog";
import AddEditBlog from "./pages/blogs/addEdit/addEditBlogs";
import LoginForm from "./pages/login/login";
import ProtectedRoute from "./pages/protectedRoute/ProtectedRoute";
import RegisterUser from "./pages/register/register";
import Dashboard from "./pages/dashboard/dashboard";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LoginForm />} />
          <Route exact path="/login" element={<LoginForm />} />
          <Route exact path="/register" element={<RegisterUser />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />}></Route>
            {/* user */}
            <Route path="/home/dashboard" element={<Dashboard />} />
            <Route path="/home/users/addUser" element={<AddEdit />} />
            <Route path="/home/users" element={<UserList />} />
            <Route path="/home/users/update/:Id" element={<AddEdit />} />
            {/* blogs */}
            <Route path="/home/blogs" element={<Blogs />} />
            <Route path="/home/blogs/add" element={<AddEditBlog />} />
            <Route path="/home/blog/update/:Id" element={<AddEditBlog />} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
