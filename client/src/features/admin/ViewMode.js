import { openModal } from "../modal/confirmationSlice";
import { updateUsername, updateEmail, updateRole, getId } from "./adminSlice";
import { useDispatch } from "react-redux";

const ViewMode = (props) => {
  const dispatch = useDispatch();

  const updateEditMode = (item) => {
    dispatch(getId(item._id));
    dispatch(updateUsername(item.username));
    dispatch(updateEmail(item.email));
    dispatch(updateRole(item.role.includes("admin")));
    props.setEditMode(!props.editMode);
  };

  return (
    <div key={props.it._id} className="flex items-start box-content w-screen">
      <div className="flex mx-2 mt-2 flex-col w-screen relative">
        <div className="flex items-end">
          <button
            title="Edit"
            disabled={props.editMode ? true : false}
            className={`rounded ${
              props.editMode ? "disabled:opacity-50 " : "hover:bg-blue-300"
            } px-1 mr-4 text-xl`}
            onClick={() => updateEditMode(props.it)}
          >
            ✍🏻
          </button>
          <span className="break-all font-bold text-blue-300 text-md mr-2">
            {props.it.username}
          </span>
          <span className="text-grey-700 mr-10 text-yellow-300 text-xs font-light">
            {props.it.role.map((role) => `[${role}]`)}
          </span>
          <button
            title="Delete"
            disabled={props.editMode ? true : false}
            className={`rounded ${
              props.editMode ? "disabled:opacity-50 " : "hover:bg-blue-300"
            } absolute right-0 top-0 my-2 px-1 text-xl`}
            onClick={() =>
              dispatch(
                openModal({ username: props.it.username, id: props.it._id })
              )
            }
          >
            🗑️
          </button>
        </div>
        <p className="break-all font-light text-md border-b border-dotted text-white pb-2 pt-1">
          {props.it.email}
        </p>
      </div>
    </div>
  );
};

export default ViewMode;
