import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../admin/adminSlice";
import {
  selectUsernameToDelete,
  closeModal,
  selectUserIdToDelete,
} from "./confirmationSlice";
import Template from "./Template";

const DeleteConfirmation = () => {
  const dispatch = useDispatch();

  const userIdToDelete = useSelector(selectUserIdToDelete);
  const usernameToDelete = useSelector(selectUsernameToDelete);

  return (
    <Template
      title="Delete account"
      message={`Are you sure you want to delete user ${usernameToDelete}?`}
      onConfirmation={() => {
        dispatch(deleteUser(userIdToDelete));
        dispatch(closeModal());
      }}
      confirmation="Delete"
      onCancelation={() => dispatch(closeModal())}
      cancelation="Cancel"
    />
  );
};

export default DeleteConfirmation;
