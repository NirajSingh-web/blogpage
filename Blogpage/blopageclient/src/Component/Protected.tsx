import { Outlet, Navigate } from "react-router-dom";
interface Authentication {
  isAuthenticated: boolean;
}
const Protected: React.FC<Authentication> = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to={"/Login"} />;
};

export default Protected;
