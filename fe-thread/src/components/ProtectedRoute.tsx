import { useEffect } from "react";
import { API, setAuthorization } from "../libs/API";
import { Outlet, useNavigate } from "react-router-dom";
import cookie from "../utils/cookie";
import { useDispatch, useSelector } from "react-redux";
import { removeSession, setSession } from "../features/auth/authSlice";
import { RootState } from "../store";
import { Spinner } from "@chakra-ui/react";

export default function ProtectedRoute() {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const checkUser = async () => {
    try {
      const token = cookie.get("token");
      const res = await API.get("/v1/user/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setSession(res.data.user));
      setAuthorization(token);
    } catch (err) {
      dispatch(removeSession());
      navigate("/login");
    }
  };

  useEffect(() => {
    checkUser();

    //eslint-disable-next-line
  }, []);

  return <>{auth.isLogin ? <Outlet /> : <Spinner ml={500} mt={10} />}</>;
}
