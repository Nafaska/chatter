import Picker from "emoji-picker-react";

export const EmojiPicker = (props) => {
  const onEmojiClick = (event, emojiObject) => {
    props.setChosenEmoji(emojiObject.emoji);
  };

  return <Picker onEmojiClick={onEmojiClick} />;
};
