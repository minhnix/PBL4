import React from "react";
import Avatar from "./Avatar";

const ChatInfo = ({ idChannel, isOnline, isDarkTheme, name, messageTime }) => {
  return idChannel != "" ? (
    <div
      className={` w-full h-16 cursor-pointer ${
        isDarkTheme ? "float-neumorphism-chat-dark" : "float-neumorphism-chat"
      } rounded-2xl flex items-center justify-between px-4 py-2`}
    >
      <div className="flex gap-2">
        <div className="relative py-2">
          <Avatar name={name} size={10} />
          {isOnline && (
            <span className="w-2 h-2 bg-green-500 rounded-full block absolute right-1 bottom-2"></span>
          )}
          {!isOnline && (
            <span className="w-2 h-2 bg-black rounded-full block absolute right-1 bottom-2"></span>
          )}
        </div>
        <div className="flex flex-col justify-between py-2">
          <span className="font-semibold dark:text-white">
            {name?.slice(0, 20)}
          </span>
          <span className="text-gray-500 dark:text-white text-[12px]">
            {isOnline ? "Active now" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default ChatInfo;
