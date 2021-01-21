import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { readToken, passToken } from "./features/auth/authSlice";

const Startup = (props) => {
  const dispatch = useDispatch();
  const token = useSelector(passToken);
  useEffect(() => {
    if (token) {
      dispatch(readToken());
    }
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
