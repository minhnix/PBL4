import React, { useState } from "react";
import { BsCameraVideoFill } from "react-icons/bs";
import { IoCall } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import Avatar from "./Avatar";

const RecievedCallPopUp = ({ name, callId, status, setStatus }) => {
  return (
    <div
      className={`absolute top-0 z-40 left-0 bg-black/30 w-full h-full ${status}`}
    >
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  rounded shadow-xl flex justify-evenly items-center px-4">
        <div className="relative w-[400px] h-[250px] flex flex-col gap-4 pt-4 bg-gray-200 items-center justify-center rounded-md">
          {/* close pop up */}
          <div className="text-black text-sm absolute top-2 right-2 w-6 h-6 rounded-full hover:opacity-60 cursor-pointer bg-slate-300 items-center justify-center flex">
            <AiOutlineClose
              className="m-auto"
              size={12}
              onClick={() => {
                setStatus("hidden");
                //close
              }}
            />
          </div>
          <Avatar name={name} className=" mx-auto" />
          <p className="text-lg font-bold">{name} is calling you.</p>
          <p className="mt-[-12px]">
            The call will start as soon as you accept.
          </p>
          <div className="flex gap-6">
            <div className="flex flex-col gap-2 items-center">
              <button className="w-10 h-10 rounded-full border-2 border-red-300 flex items-center justify-center hover:opacity-60">
                {/* chỉ tắt trên giao diện, chưa xóa trên firebase + sv */}
                <AiOutlineClose
                  size={18}
                  className="text-red-500"
                  onClick={() => {
                    setStatus("hidden");

                    // setIsAnswer();
                  }}
                />
              </button>
              <p className="text-sm">Decline</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <button className="w-10 h-10 rounded-full border-2 border-green-200 flex items-center justify-center hover:opacity-60">
                <IoCall
                  size={18}
                  className="text-green-500"
                  onClick={() => {
                    window.open(
                      `http://localhost:5173/video/?mode=join&callId=${callId}`,
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
              <p className="text-sm">Accept</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecievedCallPopUp;
