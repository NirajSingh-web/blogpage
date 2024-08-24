import React, { useState } from "react";
import axios from "axios";
const Viewpage: React.FC<any> = ({ viewdata, setvisiblity }) => {
  const [replydata, setreplydata] = useState<any>("");
  const handleonreply = async (e: any) => {
    const data = {
      postid: viewdata._id,
      commentid: e._id,
      reply: replydata,
    };
    try {
      const res = await axios.put(
        "http://localhost:4000/blog/comment/reply",
        data,
        {
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
     const res_data= await res.data;
      setreplydata("");
      window.location.reload();
    } catch (error: any) {
      console.log(error.response.data);
    }
  };
  return (
    <div className="card container">
      <div>
        <img src={`http://localhost:4000/read-image${viewdata.file.filename}`} alt="" className="aspect-video h-52 w-full" />
      </div>
      <div>
        <h4 className="h4">{viewdata.title}</h4>
        <p>
          Likes: <span className="font-semibold">{viewdata.likes.length}</span>
        </p>
        <p>{viewdata.description}</p>
        <div
          className={`${viewdata.comments.length > 2 && "overflow-y-scroll h-[50vh]"}`}
        >
          <div className=" flex flex-col  items-center justify-center ">
            <h6 className="h5">Comment</h6>
            {viewdata.comments.length != 0 &&
              viewdata.comments.map((c: any) => (
                <div className="card text-sm  xl:w-[50%]  ps-4  p-2 w-full">
                  <div className="">
                    <h4 className="h5">user:-{c.createdby}</h4>
                    <p className="text-lg">{c.content}</p>
                    <div>
                      <h2 className="h6 font-sans">{c.replies.length != 0&&"Replies"}</h2>
                      <div>
                        {c.replies.length != 0 &&
                          c.replies.map((r: any) => (
                            <div>
                              <h2>
                                user:- <span>{r.createdby}</span>
                              </h2>
                              <p>{r.content}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end me-2 mt-3 gap-3">
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e: any) => setreplydata(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => handleonreply(c)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div>
        <button
          className="absolute right-10 bottom-2 btn btn-danger"
          onClick={() => {
            setvisiblity(false);
          }}
        >
          close
        </button>
      </div>
    </div>
  );
};

export default Viewpage;
