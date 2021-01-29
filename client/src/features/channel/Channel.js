import React, { useEffect, useState } from "react";
import logo from "../../assets/cat-avatar.png";
import { ReactComponent as LogoutImg } from "../../assets/logout.svg";
import { ReactComponent as AdminPageImg } from "../../assets/adminPage.svg";
import { useHistory } from "react-router-dom";
import {
  selectChannelName,
  selectChannelDescription,
  updateChannelDescription,
  updateChannelName,
  createChannel,
  getListOfChannels,
  selectChannelList,
} from "./channelSlice";
import { selectRole } from "../auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import LogOutConfirmation from "../modal/LogOutConfirmation";
import ConfirmationModal from "../modal/ConfirmationModal";
import { openModal } from "../modal/confirmationSlice";

const Channel = () => {
  const [expandedDropdown, setExpandedDropdown] = useState(false);

  const onDropdownClick = () => {
    setExpandedDropdown(!expandedDropdown);
  };

  const history = useHistory();
  const dispatch = useDispatch();
  const listOfChannels = useSelector(selectChannelList);
  const isAdmin = useSelector(selectRole).includes("admin");
  const channelName = useSelector(selectChannelName);
  const channelDescription = useSelector(selectChannelDescription);
  const regexOnlyWhiteSpace = /^\s*$/;

  useEffect(() => {
    dispatch(getListOfChannels());
  }, [dispatch]);

  return (
    <div>
      <div className="min-h-screen flex flex-col w-full items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
        <div className="relative inline-block w-2/5 text-left">
          <button
            type="button"
            onClick={() => {
              onDropdownClick();
            }}
            className="inline-flex mt-6 justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
          >
            Select a channel
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {expandedDropdown && (
            <div className="origin-top-left absolute font-medium left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1 max-h-48 overflow-y-auto"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {listOfChannels.map((it, index) => {
                  return (
                    <button
                      className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-left"
                      role="menuitem"
                      key={`${it}_${index}`}
                      onClick={() => {
                        history.push(`/channels/${it}`);
                      }}
                    >
                      # {it}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className={expandedDropdown ? "w-2/5 invisible" : "w-2/5"}>
          <h4 className="mt-3 text-sm text-gray-500 text-center">Or</h4>
          <input
            id="new-channel"
            name="new-channel"
            value={channelName}
            onChange={(e) => {
              dispatch(updateChannelName(e.target.value));
            }}
            required
            className="mt-3 appearance-none text-sm rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-600 font-medium text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            placeholder="Create a new channel"
          />
          <input
            id="new-channel-description"
            name="new-channel-description"
            value={channelDescription}
            onChange={(e) => {
              dispatch(updateChannelDescription(e.target.value));
            }}
            className="mt-3 appearance-none text-sm rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-600 font-medium text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            placeholder="Description (optional)"
          />
          <button
            type="button"
            disabled={regexOnlyWhiteSpace.test(channelName)}
            onClick={() => {
              dispatch(createChannel(channelName, channelDescription));
              dispatch(updateChannelName(""));
              dispatch(updateChannelDescription(""));
            }}
            className="group relative mt-3 w-full disabled:opacity-70 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create
          </button>
        </div>
      </div>
      <ConfirmationModal body={<LogOutConfirmation />} />
    </div>
  );
};

export default Channel;
