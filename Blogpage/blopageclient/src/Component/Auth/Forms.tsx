import axios, { AxiosError, AxiosResponse } from "axios";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
interface formdata {
  Email: string;
  password: string;
}
interface FormsProps {
  type: "Login" | "Signup";
}
interface ErrorResponse {
  errors: Array<{ msg: string }>;
  // Add other fields if your error response contains more information
}
interface Apiresponse {
  token: string;
}
const Forms: React.FC<FormsProps> = ({ type }) => {
  const [formdata, setFormdata] = useState<formdata>({
    Email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleonchange = (e: any) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const signup = async () => {
    try {
      const res = await axios.post<Apiresponse>(
        "http://localhost:4000/user/signup",
        formdata
      );
      const data = res.data;
      if (data) {
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (er) {
      const e = er as AxiosError<ErrorResponse>;
      if (e.response?.data.errors) {
        return alert(`${e.response.data.errors[0]["msg"]}  \n`);
      } else {
        alert(e.response?.data || e.message);
      }
      console.log(e.message);
    }
  };
  const Login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/user/authenticate",
        formdata
      );
      const data = res.data;
      console.log(data);
      if (data) {
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (er) {
      const e = er as AxiosError<ErrorResponse>;
      if (e.response?.data.errors) {
        alert(e.response.data.errors.map((e: any) => `${e["msg"]}\n`));
      } else {
        alert(e.response?.data || e.message);
      }
    }
  };
  const Handleonsubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === "Login") {
      Login();
    } else {
      signup();
    }
  };
  return (
    <div
      className={`h-[100vh] w-full flex  items-center xl:justify-end justify-center  ${
        type === "Login"
          ? 'bg-[url("https://images04.nicepage.com/feature/461183/website-blog.jpg")] bg-no-repeat bg-cover'
          : 'bg-[url("https://img.freepik.com/free-vector/blog-post-concept-illustration_114360-28016.jpg?size=626&ext=jpg")]'
      } min-w-full`}
    >
      <div className="me-3 bg-slate-900 p-4 rounded-lg border-2 border-[rgba(250,250,250,0.65)]">
        <div className="text-center mb-4">
          <p className="text-white h4 underline underline-offset-8">
            {type === "Login" ? "Login Form" : "SignUp Form"}
          </p>
        </div>
        <form
          action=""
          className="flex flex-col gap-3 xl:w-[380px]"
          onSubmit={Handleonsubmit}
        >
          <div>
            <input
              type="email"
              name="Email"
              value={formdata["Email"]}
              className="form-control rounded-sm"
              placeholder="Email"
              onChange={handleonchange}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formdata["password"]}
              placeholder="Password"
              className="form-control rounded-sm"
              onChange={handleonchange}
            />
          </div>
          <div>
            <input
              type="submit"
              value={"Login"}
              className="btn btn-primary w-full rounded-sm"
            />
          </div>
          {type === "Login" && (
            <div className="text-white flex justify-center">
              <Link to="/SignUp">
                <span className="btn text-white bg-dark"> SignUp </span>
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Forms;
