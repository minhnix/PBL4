import React from "react";
import { BsCameraVideoFill } from "react-icons/bs";
import { IoCall } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import RecievedCallPopUp from "./RecievedCallPopUp";

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
                "http://localhost:5173/video/?mode=create",
                "_blank",
                "rel=noopener noreferrer"
              );
              setPage("create");
            }}
            size={20}
          />
        </button>
      ) : (
        ""
        //   <RecievedCallPopup
        //   name={"Buoi Hoang Minh"}
        //   callId={"Jv64hB17xbrEU8pJYuDZ"}
        //   status={status}
        //   setStatus={setStatus}
        // />
      )}
    </>
  );
};

export default Menu;
