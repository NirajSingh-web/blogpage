import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
const Signup = lazy(() => import("./Component/Auth/Signup"));
const Login = lazy(() => import("./Component/Auth/Login"));
const Navbar = lazy(() => import("./Component/Navbar"));
const Home = lazy(() => import("./Component/Home"));
const Addblog = lazy(() => import("./Component/blogpages/Addblog"));
import Protected from "./Component/Protected";
const Profile = lazy(() => import("./Component/blogpages/Profile"));
function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const Navigate = useNavigate();
  const Location = useLocation();
  console.log(isAuthenticated);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const path = Location.pathname;
    if (token) {
      if (path != "/Login" && path != "/SignUp") {
        setisAuthenticated(true);
        Navigate(path);
      } else {
        Navigate("/");
      }
    } else {
      setisAuthenticated(false);
    }
  }, [isAuthenticated, location.pathname]);
  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route element={<Protected isAuthenticated={isAuthenticated} />}>
          <Route
            path="/"
            element={
              <Suspense fallback={"loading..."}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/Add"
            element={
              <Suspense fallback={"loading..."}>
                <Addblog />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={"loading..."}>
                <Profile />
              </Suspense>
            }
          />{" "}
        </Route>
        <Route
          path="/Signup"
          element={
            <Suspense fallback={"loading..."}>
              <Signup />
            </Suspense>
          }
        />
        <Route
          path="/Login"
          element={
            <Suspense fallback={"loading..."}>
              <Login />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default App;
