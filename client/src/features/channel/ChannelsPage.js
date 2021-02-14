import React, { useEffect, useState } from "react";
import logo from "../../assets/catAvatar.png";
import { ReactComponent as LogoutImg } from "../../assets/logout.svg";
import { ReactComponent as AdminPageImg } from "../../assets/adminPage.svg";
import { useHistory } from "react-router-dom";
import { getListOfChannels } from "./channelSlice";
import { selectRole } from "../auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import LogOutConfirmation from "../modal/LogOutConfirmation";
import ConfirmationModal from "../modal/ConfirmationModal";
import { openModal } from "../modal/confirmationSlice";
import SelectChannel from "./SelectChannel";
import CreateChannel from "./CreateChannel";

export const rootSt = { AppHeight: "100%" };

const ChannelsPage = () => {
  const [expandedDropdown, setExpandedDropdown] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectRole).includes("admin");

  useEffect(() => {
    dispatch(getListOfChannels());
  }, [dispatch]);

  return (
    <div>
      <div className="h-screen flex flex-col w-full items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="inline-flex absolute top-0 left-0 inline-flex -space-x-px">
          <button
            title="Log Out"
            onClick={() => dispatch(openModal())}
            className="my-3 ml-3 flex justify-center p-1 border text-sm font-medium rounded-md text-white bg-gray-400 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <LogoutImg className="mx-auto h-7 w-auto" />
          </button>
          {isAdmin ? (
            <button
              onClick={() => history.push("/admin")}
              className="m-3 flex rounded-l-none justify-center p-1 border text-sm font-medium rounded-md text-white bg-gray-400 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <AdminPageImg className="mx-auto h-7 w-auto" />
            </button>
          ) : (
            false
          )}
        </div>
        <img className="mx-auto h-12 w-auto" src={logo} alt="Logo" />
        <SelectChannel
          expandedDropdown={expandedDropdown}
          setExpandedDropdown={setExpandedDropdown}
        />
        <CreateChannel expandedDropdown={expandedDropdown} />
      </div>
      <ConfirmationModal body={<LogOutConfirmation />} />
    </div>
  );
};

export default ChannelsPage;
