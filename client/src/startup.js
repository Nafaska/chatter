import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readToken, passToken } from "./features/auth/authSlice";
import { useHistory } from "react-router-dom";

const Startup = (props) => {
  const dispatch = useDispatch();
  const token = useSelector(passToken);
  const history = useHistory();

  useEffect(() => {
    const asyncFunc = async() => {
      if (token) {
        return await dispatch(readToken());
      }
      else {
        history.push("/login");
      }
    }
    asyncFunc();
  }, [dispatch, token, history]);

  return props.children
};

export default Startup;
