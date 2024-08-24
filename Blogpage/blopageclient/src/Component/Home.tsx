import axios from "axios";
import React, { useEffect, useState } from "react";
import Viewpage from "./blogpages/Viewpage";
interface Commentstype {
  [key: string]: string;
}
interface Likedtype {
  [key: string]: boolean;
}
const Home = () => {
  const [data, setdata] = useState<any>([]);
  const [Liked, setliked] = useState<Likedtype>({});
  const [visiblity, setvisiblity] = useState(false);
  const [comment, setcomment] = useState<Commentstype>({});
  const [viewdata, setviewdata] = useState([]);
  const [apihit, setapihit] = useState(false);
  useEffect(() => {
    const fetchdata = async () => {
      const res = await axios.get<any>("http://localhost:4000/blog/");
      setdata(res.data);
    };
    fetchdata();
    const intervalId = setInterval(fetchdata, 3000);
    return () => clearInterval(intervalId);
  }, []);
  const handleonlike = async (e: any) => {
    const token = localStorage.getItem("token");
    let data;
    if (Liked[e._id]) {
      data = {
        status: false,
        postid: e._id,
      };
      setliked({ ...Liked, [e._id]: false });
    } else {
      data = {
        status: true,
        postid: e._id,
      };
      setliked({ ...Liked, [e._id]: true });
    }
    const res = await axios.put("http://localhost:4000/blog/add/like", data, {
      headers: {
        "auth-token": token,
      },
    });
    const res_data = await res.data;
  };
  const handleonchange = (e: any) => {
    setcomment({ ...comment, [e.target.name]: e.target.value });
  };
  const handleoncomment = async (e: any) => {
    const commentdata = {
      _id: e._id,
      content: comment[e._id],
    };
    try {
      const res = await axios.put(
        "http://localhost:4000/blog/add/comment",
        commentdata,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      setcomment({ ...comment, [e._id]: "" });
      setapihit(false);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };
  return (
    <div className="relative">
      <div className="absolute w-full bg flex justify-center z-10">
        {visiblity && (
          <Viewpage
            viewdata={viewdata}
            visiblity={visiblity}
            setvisiblity={setvisiblity}
          />
        )}
      </div>
      <div
        className={` ${
          visiblity && "blur-sm fixed w-full"
        } flex items-center flex-col gap-4`}
      >
        {data.length != 0 ? (
          data.map((e: any) => (
            <div className="card w-[70%] mt-3 relative">
              <div className="card-body">
                <div className="card-img ">
                  <img
                    src={`http://localhost:4000/read-image${e.file.filename}`}
                    alt="kdkdk"
                    className="aspect-square h-52 w-full object-cover"
                  />
                </div>
                <div className="card-footer flex justify-between">
                  <div>
                    <span className="me-2">{e.likes.length}</span>
                    <i
                      className={`fa fa-thumbs-up ${
                        Liked[e._id || ""] && "text-primary"
                      }`}
                      onClick={() => handleonlike(e)}
                    ></i>
                  </div>
                  <div>
                    <span className="me-2">{e.comments.length}</span>
                    <i className="fa fa-comments-o"></i>
                  </div>
                </div>

                <div className="relative flex justify-between">
                  <div>
                    <h4 className="h5">This is </h4>
                    <p className="text-sm text-gray-500"></p>
                  </div>
                  <button
                    className="btn text-primary"
                    onClick={() => {
                      visiblity ? setvisiblity(false) : setvisiblity(true);
                      setviewdata(e);
                    }}
                  >
                    view
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    className="form-control w-full"
                    name={e._id}
                    value={comment[e._id] || ""}
                    onChange={handleonchange}
                  />
                  <button
                    className="btn btn-primary  btn-block"
                    onClick={() => handleoncomment(e)}
                  >
                    comment
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>anyuser have not posted any post</div>
        )}
      </div>
    </div>
  );
};

export default Home;
