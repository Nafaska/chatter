import { useEffect, useState } from "react";
import { getAllUsers, selectUsers, selectId } from "./adminSlice";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ConfirmationModal from "../modal/ConfirmationModal";
import DeleteConfirmation from "../modal/DeleteConfirmation";
import EditMode from "./EditMode";
import ViewMode from "./ViewMode";

const Admin = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const [editMode, setEditMode] = useState(false);
  const currentItemId = useSelector(selectId);
  const history = useHistory();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    setEditMode(false);
  }, [users]);

  return (
    <div className="bg-gray-800 font-mono h-screen overflow-y-auto flex flex-col w-screen box-content text-white">
      <div className="text-xl sm:m-4 m-4 mt-16">Cool Admin's Things 🔑</div>
      <button
        onClick={() => history.push("/channels")}
        className="absolute top-0 right-0 m-3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Go to Channels
      </button>
      {users.map((it) => {
        if (it._id === currentItemId && editMode) {
          return (
            <EditMode setEditMode={setEditMode} editMode={editMode} it={it} />
          );
        } else {
          return (
            <ViewMode setEditMode={setEditMode} editMode={editMode} it={it} />
          );
        }
      })}
      <ConfirmationModal body={<DeleteConfirmation />} />
    </div>
  );
};

export default Admin;
