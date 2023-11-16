import React from "react";

const ChatInfo = ({ isOnline, isDarkTheme, name, messageTime }) => {
  return (
    <div
      className={` w-full h-16 cursor-pointer ${
        isDarkTheme ? "float-neumorphism-chat-dark" : "float-neumorphism-chat"
      } rounded-2xl flex items-center justify-between px-4 py-2`}
    >
      <div className="flex gap-2">
        <div className="relative py-2">
          <span className="w-11 h-11 bg-red-500 rounded-full block"></span>

          {isOnline && (
            <span className="w-2 h-2 bg-green-500 rounded-full block absolute right-1 bottom-2"></span>
          )}
        </div>
        <div className="flex flex-col justify-between py-2">
          <span className="font-semibold dark:text-white">{name}</span>
          <span className="text-gray-500 dark:text-white text-[12px]">
            {isOnline ? "Active now" : messageTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
