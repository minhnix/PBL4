import React from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { calculateTimeDifference } from "../utils/formatTime";
import Avatar from "./Avatar";

const ChatItem = ({
  item,
  isDarkTheme,
  name,
  messageTime,
  isOnline,
  latestMessage,
  userLoggedIn,
  onClick,
}) => {
  console.log("🚀 ~ messageTime:", item);
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
          <div className="relative py-2 flex">
            <Avatar name={name} size={10} />
            {isOnline && (
              <span className="w-2 h-2 bg-green-500 rounded-full block absolute right-1 bottom-2"></span>
            )}
          </div>
          <div className="flex flex-col justify-between py-2">
            <span className="font-semibold dark:text-white">
              {name.slice(0, 20)}
            </span>
            <span className="text-gray-500 flex  gap-2 dark:text-white text-[12px]">
              <span>
                {item.messageType == "CREATE"
                  ? latestMessage
                  : userLoggedIn?.id == item.sender?.userId
                  ? "You: " + latestMessage.slice(0, 15)
                  : item.type == "group"
                  ? item.sender?.username + ": " + latestMessage.slice(0, 15)
                  : latestMessage.slice(0, 15)}
              </span>

              <span>{calculateTimeDifference(messageTime)}</span>
            </span>
          </div>
        </div>
        <div className="">
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
