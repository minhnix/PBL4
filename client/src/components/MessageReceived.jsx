import React from "react";
import Avatar from "./Avatar";
import { calculateTimeDifference } from "../utils/formatTime";

const MessageReceived = ({
  isDarkTheme,
  content,
  username,
  createdAt,
  type,
  fileUrl,
}) => {
  return (
    <div className="flex items-center gap-2 ml-2" key={createdAt}>
      <Avatar name={username} size={12} />
      <div
        className={`left-chat min-h-fit py-2  float-left break-all bg-white dark:bg-[#1A1D24] dark:text-white ${
          isDarkTheme && "float-neumorphism-chat-dark"
        } float-neumorphism-chat px-4 max-w-sm whitespace-normal flex items-center justify-center rounded-lg text-md`}
      >
        {
          //TODO: if type = file => click file to download
          type === "IMAGE" ? (
            <img src={fileUrl} alt="image-content"></img>
          ) : (
            content
          )
        }
        <div className="left-chat-tooltip text-white bg-gray-400 dark:bg-white dark:text-gray-500 min-w-12 px-2 h-8 absolute left-[120%] text-md top-[50%] translate-y-[-50%] flex items-center justify-center rounded-lg -z-10">
          <span>{calculateTimeDifference(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageReceived;
