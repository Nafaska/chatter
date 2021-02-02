import { selectChannelList } from "./channelSlice";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const SelectChannel = (props) => {
  const onDropdownClick = () => {
    props.setExpandedDropdown(!props.expandedDropdown);
  };
  const history = useHistory();
  const listOfChannels = useSelector(selectChannelList);

  return (
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
      {props.expandedDropdown && (
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
  );
};

export default SelectChannel;
