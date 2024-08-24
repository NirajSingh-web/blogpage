import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";
interface filedata {
  blogfile: File | null;
}
interface Textdata {
  title: string;
  description: string;
}
interface FormsProps {
  type: "Add" | "Edit";
  Editdata?: {
    _id: string;
    title: string;
    description: string;
  };
  seteditformvisibility?: React.Dispatch<React.SetStateAction<boolean>>;
}
const Blogform: React.FC<FormsProps> = ({
  type,
  Editdata,
  seteditformvisibility,
}) => {
  const [textdata, setTextdata] = useState<Textdata>({
    title: "",
    description: "",
  });
  const [file, setfile] = useState<filedata>({
    blogfile: null,
  });
  const formdata = new FormData();
  formdata.append("title", textdata["title"]);
  formdata.append("description", textdata["description"]);
  formdata.append("blog_image", file["blogfile"] || "");
  const handlechange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setTextdata({ ...textdata, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (type === "Edit" && Editdata) {
      setTextdata({
        title: Editdata.title,
        description: Editdata.description,
      });
    }
  }, []);
  const editdata = async () => {
    try {
      const res = await axios.put(
        `http://localhost:4000/blog/update${Editdata && Editdata._id}`,
        formdata
      );
      const data = res.data;
      alert(data);
      seteditformvisibility?.(false);
    } catch (e: any) {
      if (e.response.data.errors) {
        return alert(e.response.data.errors.map((e: any) => `${e["msg"]}\n`));
      } else {
        return alert(e.response.data.message);
      }
    }
  };
  const adddata = async () => {
    try {
      console.log("kd")
      const res = await axios.post("http://localhost:4000/blog/add", formdata, {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });
      const data = res.data;
      return alert(data);
    } catch (e: any) {
      if (e.response.data.errors) {
        return alert(e.response.data.errors.map((e: any) => `${e["msg"]}\n`));
      } else {
        return alert(e.response.data.message||e.message);
      }
    }
  };
  const handleonsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "Add") {
      adddata();
    } else {
      editdata();
    }
  };
  return (
    <div className="container flex justify-center items-center h-[90vh]">
      <div className="card xl:w-[50%] p-4">
        <form
          action=""
          className="flex gap-10 flex-col container"
          onSubmit={handleonsubmit}
        >
          <div>
            <input
              type="text"
              className="form-control"
              name="title"
              value={textdata["title"]}
              placeholder="Title"
              onChange={handlechange}
            />
          </div>
          <div>
            <input
              type="file"
              name=""
              className="form-control"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.files && e.target.files.length > 0
                  ? setfile({ blogfile: e.target.files[0] })
                  : setfile({ blogfile: null });
              }}
              accept="image/*"
            />
          </div>
          <div>
            <textarea
              name="description"
              className="form-control h-48"
              placeholder="Description"
              value={textdata["description"]}
              onChange={handlechange}
            ></textarea>
          </div>
          <div className="flex justify-between gap-10">
            <input
              type="submit"
              className="bg-primary btn btn-block w-full text-white"
              value={type === "Add" ? "Add" : "Update"}
            />
            {type === "Edit" && (
              <button
                className="btn btn-block w-full bg-danger text-white "
                onClick={() => seteditformvisibility?.(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Blogform;
