import axios from "axios";
import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../../store/store";
const Blogform = lazy(() => import("./blogform"));
interface editdatatype {
  _id: string;
  title: string;
  description: string;
}
const Profile = () => {
  const specificuserdata = useContext(DataContext);
  console.log(specificuserdata?.data);
  const [blogdata, setblogdata] = useState<any>([]);
  const [Editdata, setEdidata] = useState<editdatatype>({
    _id: "",
    title: "",
    description: "",
  });
  const [apihit, setapihit] = useState(false);
  const [Editformvisibility, seteditformvisibility] = useState<boolean>(false);
  const [profilefile, setprofile] = useState<any>(null);
  const Navigate = useNavigate();
  useEffect(() => {
    const fetchdata = async () => {
      const res = await axios.get<any>(
        "http://localhost:4000/blog/particular",
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      setblogdata(res.data);
    };
    fetchdata();
    const intervalId = setInterval(fetchdata, 3000);
    return () => clearInterval(intervalId);
  }, [apihit]);
  setTimeout(() => {
    setapihit(false);
  }, 3000);
  const handleonlogout = () => {
    const answer = confirm("Are you sure to log out?");
    if (answer) {
      localStorage.removeItem("token");
      Navigate("/Login");
    }
  };
  const handleonupdate = (e: any) => {
    setEdidata({
      _id: e._id,
      title: e.title,
      description: e.description,
    });
    seteditformvisibility(true);
  };
  const handleondelete = async (e: any, i: number) => {
    try {
      const answer: boolean = confirm("Are you sure to delete");
      if (answer) {
        const res = await axios.delete(
          `http://localhost:4000/blog/delete${e._id}`
        );
        const data = res.data;
        setapihit(true);
        alert(data);
      }
    } catch (e: any) {
      if (e.response.data.errors) {
        return alert(e.response.data.errors.map((e: any) => `${e["msg"]}\n`));
      } else {
        return alert(e.response.data.message);
      }
    }
  };
  const hanldeonprofile = async () => {
    const formdata = new FormData();
    formdata.append("file", profilefile);
    if (profilefile) {
      try {
        const res = await axios.put(
          `http://localhost:4000/user/profile/pic`,
          formdata,
          {
            headers: {
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        const data = res.data;
        window.location.reload();
        alert(data);
      } catch (e: any) {
        if (e.response.data.errors) {
          return alert(e.response.data.errors.map((e: any) => `${e["msg"]}\n`));
        } else {
          return alert(e.response.data.message || e.message);
        }
      }
    } else {
      alert("please select file");
    }
  };
  return (
    <>
      {Editformvisibility && (
        <div className="absolute  w-full z-20">
          <div className="relative">
            <Suspense fallback={"loading..."}>
              <Blogform
                type="Edit"
                Editdata={Editdata}
                seteditformvisibility={seteditformvisibility}
              />
            </Suspense>
          </div>
        </div>
      )}
      <div
        className={`container transition-all ${
          Editformvisibility && "blur-sm brightness-30 transition-all"
        }`}
      >
        <div className="card">
          <div className="card-body flex justify-between items-center">
            <div className="flex justify-center flex-col items-center">
              <div>
                <img
                  src={`${
                    specificuserdata?.data &&specificuserdata?.data.file&&
                    `http://localhost:4000/read-image${specificuserdata?.data.file.filename}`
                  }`}
                  className="h-40 w-40 rounded-full"
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://cdn-icons-png.flaticon.com/512/9203/9203764.png";
                  }}
                />
                <input
                  type="file"
                  id="profile"
                  className="hidden"
                  onChange={(e: any) => setprofile(e.target.files[0])}
                />
              </div>
              <div>
                <label htmlFor="profile" className="btn btn-primary me-3">
                  {profilefile ? profilefile["name"] : "choose"}
                </label>
                <button className="btn btn-primary" onClick={hanldeonprofile}>
                  upload
                </button>
              </div>
            </div>
            <div>
              <p></p>
              <button className="btn btn-info" onClick={handleonlogout}>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {blogdata.length != 0 ? (
          <table className="table  table-bordered text-center mt-2 table-striped">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Comment</th>
              <th>Like</th>
            </tr>
            {blogdata.map((e: any, i: number) => (
              <tr>
                <td>{e.title}</td>
                <td>{e.description.slice(0, 30)}...</td>
                <td>{e.comments.length}</td>
                <td>{e.likes.length}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleonupdate(e)}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger overflow-hidden"
                    onClick={() => handleondelete(e, i)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </table>
        ) : (
          <div>
            You have no post{" "}
            <Link to="/add">
              <span className="btn-primary btn">add Post</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
export default Profile;
