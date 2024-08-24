import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DataContext } from "../store/store";
interface Authentication {
  isAuthenticated: boolean;
}
const Navbar: React.FC<Authentication> = ({ isAuthenticated }) => {
  const specificuserdata = useContext(DataContext);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [toggle, setToggle] = useState<boolean>(false);
  const [active, setactive] = useState("");
  const Location = useLocation();
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width:800px)");
    setIsMobile(mediaQuery.matches);
    const handleonchange = (e: any) => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener("change", handleonchange);
    return () => {
      mediaQuery.removeEventListener("change", handleonchange);
    };
  }, []);
  useEffect(() => {
    const path = Location.pathname;
    const patharray = path.split("/");
    setactive(patharray[patharray.length - 1]);
  }, [Location.pathname]);
  return (
    <div className="sticky top-0 z-30 w-[100%]">
      <nav className="bg-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16">
            <div>
              <div className="flex items-center">
                {/* Mobile menu button */}
                <div className="-mr-2 flex md:hidden">
                  <button
                    type="button"
                    className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    aria-expanded="false"
                    onClick={() =>
                      toggle ? setToggle(false) : setToggle(true)
                    }
                  >
                    <i
                      className={`${toggle ? "fa fa-close" : "fa fa-bars"}`}
                    ></i>
                  </button>
                </div>
                <span className="text-gray-300 px-3 py-2 rounded-md text-lg font-medium">
                  Blog
                </span>

                <div
                  className={`${
                    isMobile &&
                    toggle &&
                    "transition-all w-full absolute top-[63px] bg-gray-800 right-0 pb-3"
                  }`}
                >
                  <div
                    className={`flex transition-all ${
                      isMobile
                        ? toggle
                          ? "flex-col items-center w-full h-auto "
                          : "w-0 overflow-hidden h-0"
                        : " flex-row ml-10 space-x-4"
                    } `}
                  >
                    {/*  navigation links here */}
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/"
                          className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium  ${
                            active === "" && "bg-white text-black"
                          }`}
                        >
                          <span
                            onClick={() => (
                              isMobile && setToggle(false), setactive("")
                            )}
                          >
                            Dashboard
                          </span>
                        </Link>
                        <Link
                          to="/add"
                          className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium  ${
                            active === "add" && "bg-white text-black"
                          }`}
                        >
                          <span
                            onClick={() => (
                              isMobile && setToggle(false), setactive("Add")
                            )}
                          >
                            Add
                          </span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/Login"
                          className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                            active === "Login" && "bg-white text-black"
                          }`}
                        >
                          <span
                            onClick={() => (
                              isMobile && setToggle(false), setactive("Login")
                            )}
                          >
                            Login
                          </span>
                        </Link>
                        <Link
                          to="/SignUp"
                          className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                            active === "SignUp" && "bg-white text-black"
                          }`}
                        >
                          <span
                            onClick={() => (
                              isMobile && setToggle(false), setactive("SignUp")
                            )}
                          >
                            SignUp
                          </span>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Link to={"/profile"}>
                <img
                  src={`${
                    isAuthenticated
                      ? specificuserdata &&
                        specificuserdata?.data &&
                        `http://localhost:4000/read-image${
                          specificuserdata?.data.file &&
                          specificuserdata?.data.file.filename
                        }`
                      : ""
                  }`}
                  className="h-14 w-14 rounded-full"
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://cdn-icons-png.flaticon.com/512/9203/9203764.png";
                  }}
                />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
