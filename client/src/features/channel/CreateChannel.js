import {
  selectChannelName,
  selectChannelDescription,
  updateChannelDescription,
  updateChannelName,
  createChannel,
} from "./channelSlice";
import { useSelector, useDispatch } from "react-redux";

const CreateChannel = (props) => {
  const dispatch = useDispatch();
  const channelName = useSelector(selectChannelName);
  const channelDescription = useSelector(selectChannelDescription);
  const regexOnlyWhiteSpace = /^\s*$/;

  return (
    <div className={props.expandedDropdown ? "w-2/5 invisible" : "w-2/5"}>
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
  );
};

export default CreateChannel;
