import Spinner from "../helpers/Spinner";
import { topography } from "hero-patterns";
import { selectUsername } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { selectName, selectChannelsContent } from "./chatSlice";
import ChatMessage from "./ChatMessage";

const ChatMessageList = () => {
  const name = useSelector(selectName);
  const channelsContent = useSelector(selectChannelsContent);
  const username = useSelector(selectUsername);
  const style = process.env.NODE_ENV !== "test" ? {
    backgroundImage: topography("#F3D5AD", 0.5),
    height: "calc(100% - 9.5rem)",
  } : {
    height: "calc(100% - 9.5rem)",
  };

  return (
    <div
      id="channel"
      data-testid="channel-content"
      style={style}
      className="backgroundStyle border-b box-border px-6 pt-4 sm:pb-8 pb-24 overflow-y-auto items-center"
    >
      {!name && <Spinner height="h-full" />}
      {name && channelsContent[name]
        && Object.values(channelsContent[name]).map((it) => {
            return (
              <ChatMessage
                key={it.time + it.username}
                data={it}
                isOwn={username === it.username}
              />
            );
          })}
      <div className="h-1 auto-overflow-anchoring"></div>
    </div>
  );
};

export default ChatMessageList;
