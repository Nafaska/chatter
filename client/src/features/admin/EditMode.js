import {
  updateUsername,
  selectNewUsername,
  updateEmail,
  selectNewEmail,
  selectIsAdmin,
  updateRole,
  asyncUpdateUser,
} from "./adminSlice";
import { useSelector, useDispatch } from "react-redux";

const EditMode = (props) => {
  const dispatch = useDispatch();
  const newUsername = useSelector(selectNewUsername);
  const isAdmin = useSelector(selectIsAdmin);
  const newEmail = useSelector(selectNewEmail);

  return (
    <div key={props.it._id} className="flex items-start">
      <div className="flex w-screen flex-col relative mx-2 mt-2">
        <div className="flex relative items-end">
          <button
            title="Save"
            className="rounded px-1 mr-1 text-xl hover:bg-blue-300"
            onClick={() => {
              dispatch(asyncUpdateUser());
            }}
          >
            💾
          </button>
          <button
            title="Cancel"
            className="rounded px-2 mr-4 text-xl hover:bg-blue-300"
            onClick={() => {
              props.setEditMode(!props.editMode);
            }}
          >
            ↩️
          </button>
          <input
            placeholder={props.it.username}
            onChange={(e) => {
              dispatch(updateUsername(e.target.value));
            }}
            value={newUsername}
            className="font-bold pl-2 py-1 text-blue-300 bg-gray-500 rounded text-md mr-2"
          ></input>
          <span className="text-grey-700 text-yellow-300 text-xs font-light">
            {isAdmin ? "[user] [admin]" : "[user]"}
          </span>
          <button
            onClick={() => {
              dispatch(updateRole(!isAdmin));
            }}
            className="absolute transform hover:scale-110 motion-reduce:transform-none right-0 text-grey-700 text-yellow-300 text-xs"
          >
            {isAdmin ? "❌ Remove Admin" : "✅ Set as Admin"}
          </button>
        </div>
        <input
          placeholder={props.it.email}
          value={newEmail}
          onChange={(e) => dispatch(updateEmail(e.target.value))}
          className="font-light mt-2 bg-gray-500 rounded pl-2 text-md text-white py-1"
        ></input>
        <div className="border-b mt-2 border-dotted"></div>
      </div>
    </div>
  );
};

export default EditMode;
