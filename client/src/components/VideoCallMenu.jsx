import React from "react";
import { BsCameraVideoFill } from "react-icons/bs";
import { IoCall } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";

const Menu = ({ setPage, isDarkTheme, isAnswer, setIsAnswer }) => {
  return (
    <>
      {!isAnswer ? (
        <button
          className={` w-[40px] h-[40px] rounded-full cursor-pointer feature-btn ${
            isDarkTheme
              ? "float-neumorphism-chat-dark feature-btn-dark"
              : "float-neumorphism-chat feature-btn"
          } flex items-center justify-center text-[#495FB8]`}
        >
          <BsCameraVideoFill
            onClick={() => {
              window.open(
                "http://127.0.0.1:5173/video/?mode=create",
                "_blank",
                "rel=noopener noreferrer"
              );
              setPage("create");
            }}
            size={20}
          />
        </button>
      ) : (
        // Khi có cuộc gọi
        <>
          <button className="w-10 h-10 rounded-full border-2 border-green-200 flex items-center justify-center hover:opacity-60">
            <IoCall
              size={18}
              className="text-green-500"
              onClick={() => {
                window.open(
                  "http://127.0.0.1:5173/video/?mode=join&callId=YV6vvbn0O7PyxZxxVsh6",
                  "_blank",
                  "rel=noopener noreferrer"
                );
                setPage("join");
                console.log({
                  offerId: "user1id",
                  answerId: "user2id",
                  channelId: "channelId",
                  callId: "callId",
                  isAccepted: true,
                });
              }}
            />
          </button>
          <button className="w-10 h-10 rounded-full border-2 border-red-300 flex items-center justify-center hover:opacity-60">
            {/* chỉ tắt trên giao diện, chưa xóa trên firebase + sv */}
            <AiOutlineClose
              size={18}
              className="text-red-500"
              onClick={setIsAnswer}
            />
          </button>
        </>
      )}
    </>
  );
};

export default Menu;