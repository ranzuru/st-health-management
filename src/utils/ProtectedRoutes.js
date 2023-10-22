import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ component: Component }) {
  const tokenFromRedux = useSelector((state) => state.auth.token);

  if (tokenFromRedux) {
    return <Component />;
  } else {
    return <Navigate to="/" />;
  }
}

export default ProtectedRoute;
