import logo from "../../assets/cat-avatar.png";
import { useHistory } from "react-router-dom";
import { expandedDropdown, dropdownState } from "./channelSlice";
import { useSelector, useDispatch } from "react-redux";

const Channel = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isDropdownOpen = useSelector(dropdownState);

  return (
    <div className="min-h-screen flex flex-col w-full items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <img className="mx-auto h-12 w-auto" src={logo} alt="Logo" />
      <div className="relative inline-block w-2/5 text-left">
        <button
          type="button"
          onClick={() => {
            dispatch(expandedDropdown());
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
        {isDropdownOpen && (
          <div className="origin-top-left absolute font-medium left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <button
                href=""
                className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-left"
                role="menuitem"
                onClick={() => history.push("/chat")}
              >
                # General
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={isDropdownOpen ? "w-2/5 opacity-0" : "w-2/5"}>
        <h4 className="mt-3 text-sm text-gray-500 text-center">Or</h4>
        <input
          id="new-channel"
          name="new-channel"
          required
          className="mt-3 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-600 font-medium text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 sm:text-sm"
          placeholder="Create a new channel"
        />
        <button
          type="button"
          onClick={() => history.push("/chat")}
          className="group relative mt-3 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default Channel;