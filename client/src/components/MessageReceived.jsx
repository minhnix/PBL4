import React from "react";
import Avatar from "./Avatar";
import { AiFillFileText } from "react-icons/ai";
import MessagePopUpModal from "./MessagePopUpModal";
import { calculateTimeDifference } from "../utils/formatTime";

const MessageReceived = ({
  isDarkTheme,
  content,
  username,
  createdAt,
  type,
  fileUrl,
  isGroup,
}) => {
  return (
    <div className="flex gap-2 ml-2 flex-col" key={createdAt}>
      {isGroup && <p className="text-sm pl-[60px]">{username}</p>}
      <div className="flex items-center gap-2 ml-2 ">
        <Avatar name={username} size={12} />
        <div
          className={`left-chat min-h-fit float-left break-all bg-white dark:bg-[#1A1D24] dark:text-white ${
            isDarkTheme && "float-neumorphism-chat-dark"
          } float-neumorphism-chat max-w-sm whitespace-normal flex items-center justify-center rounded-lg text-md`}
        >
          {type === "IMAGE" ? (
            <MessagePopUpModal fileUrl={fileUrl} />
          ) : type === "FILE" ? (
            <a
              href={fileUrl}
              download
              className="flex py-2 px-4 items- justify-between hover:opacity-80"
            >
              <div>
                <AiFillFileText
                  size={24}
                  className=" relative bg-gray-300 w-[40px] h-[40px] rounded-full p-2 text-black flex-1 mr-4"
                />
              </div>
              <p className=" border-gray border-l-2 pl-4 w-[80%] m-auto">
                {content}
              </p>
            </a>
          ) : type === "VIDEO" ? (
            <div>
              <video src={fileUrl} controls></video>
            </div>
          ) : (
            <p className="px-4 py-2">{content}</p>
          )}
          <div className="left-chat-tooltip text-white bg-gray-400 dark:bg-white dark:text-gray-500 min-w-12 px-2 h-8 absolute left-[120%] text-md top-[50%] translate-y-[-50%] flex items-center justify-center rounded-lg -z-10">
            <span>{calculateTimeDifference(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageReceived;
