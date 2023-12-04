import MessagePopUpModal from "./MessagePopUpModal";

import React from "react";
import { AiFillFileText } from "react-icons/ai";
import { calculateTimeDifference } from "../utils/formatTime";
const MessageSend = ({ createdAt, content, fileUrl, type }) => {
  return (
    <div className="" key={createdAt}>
      <div
        className={`mr-4 min-h-fit right-chat float-right break-all  text-white float-neumorphism-chatBox  max-w-sm whitespace-normal rounded-lg flex items-center justify-center text-md ${
          type === "IMAGE" || type === "VIDEO"
            ? "bg-transpent cursor-pointer"
            : "bg-[#8090CB] px-4 py-2"
        }`}
      >
        {type === "IMAGE" ? (
          <MessagePopUpModal fileUrl={fileUrl} />
        ) : type === "FILE" ? (
          <a
            href={fileUrl}
            download
            className="flex px-1 items-center justify-between hover:opacity-80"
          >
            <div>
              <AiFillFileText
                size={24}
                className=" relative bg-gray-300 w-[40px] h-[40px] rounded-full p-2 text-black flex-1 mr-4"
              />
            </div>
            <p className=" border-gray border-l-2 pl-4 w-[80%]">{content}</p>
          </a>
        ) : type === "VIDEO" ? (
          <div>
            <video src={fileUrl} controls></video>
          </div>
        ) : (
          content
        )}
        <div className="right-chat-tooltip bg-gray-400 min-w-12 dark:bg-white dark:text-gray-500 px-2 h-8 absolute right-[120%] text-sm top-[50%] translate-y-[-50%] flex items-center justify-center rounded-lg -z-10">
          <span>{calculateTimeDifference(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageSend;
