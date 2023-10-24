import React from "react";
import Avatar from "./Avatar.jsx";

const ChatSearchItem = ({ isDarkTheme, channelName, channelId, onClick }) => {
  return (
    <>
      <div
        className={` w-full h-16 cursor-pointer ${
          isDarkTheme
            ? "float-neumorphism-chat-dark chat-item-dark"
            : "float-neumorphism-chat chat-item"
        } rounded-2xl flex items-center justify-between px-4 py-2`}
        onClick={onClick}
      >
        <div className="flex gap-2">
          <div className="flex justify-between py-2 items-center gap-2 relative">
            <Avatar name={channelName} size={10} />
            <span className="font-semibold dark:text-white">{channelName.slice(0,20)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSearchItem;
