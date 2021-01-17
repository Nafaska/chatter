import Picker from "emoji-picker-react";

export const Emoji = (props) => {
  const onEmojiClick = (event, emojiObject) => {
    props.setChosenEmoji(emojiObject.emoji);
  };

  return <Picker onEmojiClick={onEmojiClick} />;
};
