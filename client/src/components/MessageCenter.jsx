import React from "react";

const MessageCenter = ({ messagetypeType, content, isDarkTheme }) => {
  return (
    <div
      className={`mx-auto ${
        isDarkTheme && "text-white"
      } text-bold text-md  dark:border-gray-700`}
    >
      <p>{content}</p>
    </div>
  );
};

export default MessageCenter;
