import { useDispatch } from "react-redux";
import { logout } from "../auth/authSlice";
import {
  closeModal,
} from "./confirmationSlice";
import Template from "./Template";

const LogOutConfirmation = () => {
  const dispatch = useDispatch();

  return (
    <Template
      title="Log Out"
      message={`Are you sure you want to log out?`}
      onConfirmation={() => {
        dispatch(logout());
        dispatch(closeModal());
      }}
      confirmation="Log Out"
      onCancelation={() => dispatch(closeModal())}
      cancelation="Cancel"
    />
  );
};

export default LogOutConfirmation;
