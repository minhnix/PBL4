import React from "react";

import {
  FaChevronUp,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
const BottomBar = ({ goToBack, toggleCameraAudio, userVideoAudio }) => {
  return (
    <div className="absolute text-white right-0 bottom-4 w-full h-[8%] flex items-center justify-center font-medium gap-4">
      <button
        className="w-20 h-20 bg-red-400 rounded-full flex items-center justify-center"
        onClick={(e) => e.currentTarget === e.target && toggleCameraAudio(e)}
        data-switch="video"
      >
        {userVideoAudio.video ? (
          <FaVideo size={24}></FaVideo>
        ) : (
          <FaVideoSlash size={24}></FaVideoSlash>
        )}
      </button>
      <button
        className="w-20 h-20 bg-red-400 rounded-full flex items-center justify-center"
        onClick={(e) => e.currentTarget === e.target && toggleCameraAudio(e)}
        data-switch="audio"
      >
        {userVideoAudio.audio ? (
          <FaMicrophone size={24} />
        ) : (
          <FaMicrophoneSlash size={24} />
        )}
      </button>
      <button
        className="w-20 h-20 bg-red-400 rounded-full flex items-center justify-center"
        onClick={goToBack}
      >
        <FaPhoneSlash size={24} />
      </button>
    </div>
  );
};

export default BottomBar;
