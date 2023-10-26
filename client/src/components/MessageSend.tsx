import React from "react";
import { calculateTimeDifference } from "../utils/formatTime";
const MessageSend = ({ createdAt, content }) => {
  return (
    <div className="" key={createdAt}>
      <p
        className={`relative mr-4 right-chat float-right break-all bg-[#8090CB] text-white float-neumorphism-chatBox px-2 py-2 max-w-sm whitespace-normal rounded flex items-center justify-center text-sm`}
      >
        {content}
        <div className="right-chat-tooltip bg-gray-400 min-w-12 dark:bg-white dark:text-gray-500 px-2 h-8 absolute right-[120%] text-sm top-[50%] translate-y-[-50%] flex items-center justify-center rounded -z-10">
          <span>{calculateTimeDifference(createdAt)}</span>
        </div>
      </p>
    </div>
  );
};

export default MessageSend;
