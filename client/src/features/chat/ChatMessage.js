import avatar from "../../assets/catAvatar.png";
// import { useSelector } from "react-redux";
// import { selectUsername } from "../auth/authSlice";

const ChatMessage = (props) => {

  const { time, username, message} = props.data;
  const isOwn = props.isOwn;

  return (
    <div
      key={time}
      className="flex items-start mb-4 no-overflow-anchoring"
    >
      <img
        src={avatar}
        className="w-12 h-12 rounded-full mr-3"
        alt="user avatar"
      />
      <div className="flex flex-col">
        <div className="flex items-end">
          {isOwn ? (
            <span
              data-testid="isOwnUsername"
              className="font-bold text-blue-700 text-md mr-2"
            >
              {username}
            </span>
          ) : (
            <span data-testid="username" className="font-bold text-md mr-2">
              {username}
            </span>
          )}
          <span data-testid="time" className="text-grey-700 text-xs font-light">
            {new Date(time).toLocaleString()}
          </span>
        </div>
        <p
          data-testid="message"
          className="font-light break-words text-md text-grey-800 pt-1"
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
