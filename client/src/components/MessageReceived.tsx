import React from "react";
import Avatar from "./Avatar";
import { calculateTimeDifference } from "../utils/formatTime";

const MessageReceived = ({
  isDarkTheme,
  content,
  username,
  createdAt,
}) => {
  return (
    <div className="flex items-center gap-2 ml-2" key={createdAt}>
      <Avatar name={username} size={10} />

      <div
        className={`left-chat float-left break-all bg-white dark:bg-[#1A1D24] dark:text-white ${
          isDarkTheme && "float-neumorphism-chat-dark"
        } float-neumorphism-chat px-2 py-2 max-w-sm whitespace-normal flex items-center justify-center rounded text-sm`}
      >
        {content}
        <div className="left-chat-tooltip text-white bg-gray-400 dark:bg-white dark:text-gray-500 min-w-12 px-2 h-8 absolute left-[120%] text-sm top-[50%] translate-y-[-50%] flex items-center justify-center rounded -z-10">
          <span>{calculateTimeDifference(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageReceived;
