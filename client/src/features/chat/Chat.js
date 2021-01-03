import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  typeMessage,
  postMessage,
  selectMessage,
  selectChannel,
} from "./chatSlice";
import { selectEmail } from "../login/loginSlice";
// import { useHistory } from "react-router-dom";
const Chat = () => {
  // const history = useHistory();

  const dispatch = useDispatch();
  const message = useSelector(selectMessage);
  const channel = useSelector(selectChannel);
  const email = useSelector(selectEmail);

  console.log(email);

  return (
    <div className="w-full border shadow bg-white">
      <div className="flex">
        <div className="bg-purple-900 text-purple-400 w-1/5 pb-6 hidden md:block">
          <h1 className="text-white text-xl mb-2 mt-3 px-4 font-sans flex justify-between">
            <span>Chat</span>
            <svg
              className="h-6 w-6 text-purple-400 fill-current"
              viewBox="0 0 32 32"
            >
              <g id="surface1"></g>
            </svg>
          </h1>
          <div className="flex items-center mb-6 px-4">
            <span className="bg-green-600 rounded-full block w-2 h-2 mr-2"></span>
            <span className="text-purple-400">Olivia</span>
          </div>

          <div className="px-4 mb-2 font-sans">Channels</div>
          <div className="bg-teal-600 mb-6 py-1 px-4 text-white font-semi-bold ">
            <span className="pr-1 text-grey-300">#</span> general
          </div>

          <div className="px-4 mb-3 font-sans">Direct Messages</div>

          <div className="flex items-center mb-3 px-4">
            <span className="bg-green-600 rounded-full block w-2 h-2 mr-2"></span>
            <span className="text-purple-400">
              Olivia Dunham <i className="text-grey text-sm">(me)</i>
            </span>
          </div>

          <div className="flex items-center mb-3 px-4">
            <span className="bg-green-600 rounded-full block w-2 h-2 mr-2"></span>
            <span className="text-purple-400">Adam Bishop</span>
          </div>

          <div className="flex items-center px-4 mb-6">
            <span className="border rounded-full block w-2 h-2 mr-2"></span>
            <span className="text-purple-400">killgt</span>
          </div>

          <div className="px-4 mb-3 font-sans">Applications</div>
        </div>

        <div className="w-full h-screen flex flex-col">
          <div className="border-b flex px-6 py-2 items-center">
            <div className="flex flex-col">
              <h3 className="text-grey-900 text-md mb-1 font-extrabold">
                #general
              </h3>
              <div className="text-grey font-light text-sm">
                Chit-chattin' about ugly HTML and mixing of concerns.
              </div>
            </div>
            <div className="ml-auto hidden md:block">
              <input
                type="search"
                placeholder="Search"
                className="border border-grey-600 rounded-lg p-2"
              />
            </div>
          </div>

          <div id="channel" className="px-6 py-4 flex-1 overflow-y-auto">
            {channel.map((it) => {
              return (
                <div key={it.time} className="flex items-start mb-4 no-overflow-anchoring">
                  <img
                    src="https://avatars2.githubusercontent.com/u/343407?s=460&v=4"
                    className="w-10 h-10 rounded mr-3"
                    alt="user avatar"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-end">
                      <span className="font-bold text-md mr-2 font-sans">
                        {/* { typeof it.username !== "undefined" ? it.username : it.email} */}
                        {email}
                      </span>
                      <span className="text-grey-700 text-xs font-light">
                        {new Date(it.time).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-light text-md text-grey-800 pt-1">
                      {it.message}
                    </p>
                  </div>
                </div>
              );
            })}
            <div className="h-1 auto-overflow-anchoring"></div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(postMessage(message));
              const channelEl = document.getElementById("channel");
              channelEl.scrollTop = channelEl.scrollHeight;
            }}
            className="flex m-6 rounded-lg border-2 border-grey overflow-hidden"
          >
            <span className="text-3xl text-grey px-3 border-r-2 border-grey">
              +
            </span>
            <input
              type="text"
              className="w-full px-4"
              placeholder="Message to #general"
              value={message}
              onChange={(e) => {
                dispatch(typeMessage(e.target.value));
              }}
            />
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
