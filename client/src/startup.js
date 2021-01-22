import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { readToken, passToken } from "./features/auth/authSlice";
import history from "./history";

const Startup = (props) => {
  const dispatch = useDispatch();
  const token = useSelector(passToken);
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
  }, [dispatch, token]);

  return props.children
};

Startup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Startup;
