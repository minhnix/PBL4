import React from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
const ChatItem = ({ isDarkTheme, name, messageTime, isOnline, onClick }) => {
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
          <div className="relative py-2">
            <span className="w-11 h-11 bg-red-500 rounded-full block"></span>
            {isOnline && (
              <span className="w-2 h-2 bg-green-500 rounded-full block absolute right-1 bottom-2"></span>
            )}
          </div>
          <div className="flex flex-col justify-between py-2">
            <span className="font-semibold dark:text-white">{name}</span>
            <span className="text-gray-500 dark:text-white text-[12px]">
              You : Nix iu Vinh - {messageTime}
            </span>
          </div>
        </div>
        <div className="">
          {" "}
          <MdOutlineMoreHoriz
            size={20}
            className={`cursor-pointer dark:text-white`}
          />
        </div>
      </div>
    </>
  );
};

export default ChatItem;
