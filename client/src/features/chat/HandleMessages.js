import avatar from "../../assets/cat-avatar.png";
import Spinner from "../helpers/Spinner";
import { topography } from "hero-patterns";
import { useSelector } from "react-redux";
import { selectName, selectChannelsContent } from "./chatSlice";
import { selectUsername } from "../auth/authSlice";

const HandleMessages = () => {
  const username = useSelector(selectUsername);
  const name = useSelector(selectName);
  const channelsContent = useSelector(selectChannelsContent);
  const backgroundStyle = {
    backgroundImage: topography("#F3D5AD", 0.5),
  };

  return (
    <div
      id="channel"
      style={backgroundStyle}
      className="border-b px-6 py-4 flex-1 overflow-y-auto"
    >
      {!name && <Spinner height="h-4/5" />}
      {channelsContent[name]
        ? Object.values(channelsContent[name]).map((it) => {
            return (
              <div
                key={it.time}
                className="flex items-start mb-4 no-overflow-anchoring"
              >
                <img
                  src={avatar}
                  className="w-12 h-12 rounded-full mr-3"
                  alt="user avatar"
                />
                <div className="flex flex-col">
                  <div className="flex items-end">
                    {it.username === username ? (
                      <span className="font-bold text-blue-700 text-md mr-2">
                        {it.username}
                      </span>
                    ) : (
                      <span className="font-bold text-md mr-2">
                        {it.username}
                      </span>
                    )}
                    <span className="text-grey-700 text-xs font-light">
                      {new Date(it.time).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-light break-words text-md text-grey-800 pt-1">
                    {it.message}
                  </p>
                </div>
              </div>
            );
          })
        : " "}
      <div className="h-1 auto-overflow-anchoring"></div>
    </div>
  );
};

export default HandleMessages;
