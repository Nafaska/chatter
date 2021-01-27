import { useEffect, useState } from "react";
import {
  getAllUsers,
  selectUsers,
  updateUsername,
  selectNewUsername,
  updateEmail,
  selectNewEmail,
  selectIsAdmin,
  deleteUser,
  updateRole,
  selectId,
  getId,
  asyncUpdateUser,
} from "./adminSlice";
import { useSelector, useDispatch } from "react-redux";

const Admin = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const [editMode, setEditMode] = useState(false);
  const newUsername = useSelector(selectNewUsername);
  const isAdmin = useSelector(selectIsAdmin);
  const newEmail = useSelector(selectNewEmail);
  const currentItemId = useSelector(selectId);

  const updateEditMode = (item) => {
    dispatch(getId(item._id));
    dispatch(updateUsername(item.username));
    dispatch(updateEmail(item.email));
    dispatch(updateRole(item.role.includes("admin")));
    setEditMode(!editMode);
  };

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    setEditMode(false);
  }, [users]);

  return (
    <div className="bg-gray-800 font-mono h-screen overflow-y-auto flex flex-col w-screen box-content text-white">
      <div className="text-xl m-4">Cool Admin's Things 🔑</div>
      {users.map((it) => {
        if (it._id === currentItemId && editMode) {
          return (
            <div key={it._id} className="flex items-start m-2">
              <div className="flex w-screen flex-col relative">
                <div className="flex relative w-2/3 items-end">
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
                      setEditMode(!editMode);
                    }}
                  >
                    ↩️
                  </button>
                  <input
                    placeholder={it.username}
                    onChange={(e) => {
                      dispatch(updateUsername(e.target.value));
                    }}
                    value={newUsername}
                    className="font-bold pl-2 text-blue-300 bg-gray-500 rounded text-md mr-2"
                  ></input>
                  <span className="text-grey-700 text-yellow-300 text-xs font-light">
                    {it.role.map((role) => `[${role}]`)}
                  </span>
                  <button
                    onClick={() => {
                      dispatch(updateRole(!isAdmin));
                    }}
                    className="absolute transform hover:scale-110 motion-reduce:transform-none right-0 text-grey-700 text-yellow-300 text-xs"
                  >
                    {it.role.includes("admin")
                      ? "❌ Remove Admin"
                      : "✅ Set as Admin"}
                  </button>
                </div>
                <input
                  placeholder={it.email}
                  value={newEmail}
                  onChange={(e) => dispatch(updateEmail(e.target.value))}
                  className="font-light mt-1 w-2/3 bg-gray-500 rounded pl-2 text-md text-white pt-1"
                ></input>
              </div>
            </div>
          );
        } else {
          return (
            <div key={it._id} className="flex items-start box-content w-screen">
              <div className="flex mx-2 mt-2 flex-col w-screen relative">
                <div className="flex items-end">
                  <button
                    title="Edit"
                    disabled={editMode ? true : false}
                    className={`rounded ${
                      editMode ? "disabled:opacity-50 " : "hover:bg-blue-300"
                    } px-1 mr-4 text-xl`}
                    onClick={() => updateEditMode(it)}
                  >
                    ✍🏻
                  </button>
                  <span className="font-bold text-blue-300 text-md mr-2">
                    {it.username}
                  </span>
                  <span className="text-grey-700 text-yellow-300 text-xs font-light">
                    {it.role.map((role) => `[${role}]`).sort()}
                  </span>
                  <button
                    title="Delete"
                    className={`rounded absolute right-0 top-0 my-3 hover:bg-blue-300 px-1 text-xl`}
                    onClick={() => {
                      dispatch(deleteUser(it._id));
                    }}
                  >
                    🗑️
                  </button>
                </div>
                <p className="font-light text-md border-b border-dotted text-white pb-2 pt-1">
                  {it.email}
                </p>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Admin;
