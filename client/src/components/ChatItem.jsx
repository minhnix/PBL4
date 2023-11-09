import axios from "axios";
import Avatar from "./Avatar";
import AddUserPopUp from "./AddUserPopUp";
import React, { useState, useEffect } from "react";
import { calculateTimeDifference } from "../utils/formatTime";
import { MdOutlineMoreHoriz, MdDeleteSweep } from "react-icons/md";

const ChatItem = ({
  item,
  isDarkTheme,
  name,
  messageTime,
  isOnline,
  latestMessage,
  userLoggedIn,
  onClick,
  leaveGroup,
  addMember,
}) => {
  const [isShowMenuChatItem, setIsShowMenuChatItem] = useState("hidden");

  const [channelInfor, setChannelInfor] = useState(null);
  const [isShowSearchBox, setIsShowSearchBox] = useState(false);
  const [listUserToShow, setListUserToShow] = useState([]);
  const [listUsersAdd, setListUsersAdd] = useState([]);
  const [searchUserText, setSearchUserText] = useState("");
  const token = localStorage.getItem("token");
  const resetData = () => {
    setListUsersAdd([]);
    setSearchUserText("");
    setIsShowSearchBox(false);
  };
  const handleSearchUser = async (e, channelInfor) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/users/search?q=${e}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setListUserToShow(
        res.data.filter(
          (itemA) => !channelInfor.some((itemB) => itemB.id === itemA.id)
        )
      );
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleGetInforChannel = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/channels/${item?.channelId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChannelInfor(res.data.users);
    } catch (err) {
      console.log(
        "🚀 ~ file: ChatItem.jsx:54 ~ handleGetInforChannel ~ err:",
        err
      );
    }
  };
  useEffect(() => {
    handleGetInforChannel();
  }, []);
  return (
    <>
      <div
        className={` w-full h-16 relative cursor-pointer ${
          isDarkTheme
            ? "float-neumorphism-chat-dark chat-item-dark"
            : "float-neumorphism-chat chat-item"
        } rounded-2xl flex items-center justify-between px-4 py-2`}
        onClick={onClick}
      >
        <div className="flex gap-3">
          <div className="relative py-1 flex">
            <Avatar name={name} size={12} />
            {isOnline && (
              <span className="w-2 h-2 bg-green-500 rounded-full block absolute right-1 bottom-2"></span>
            )}
          </div>
          <div className="flex flex-col justify-between py-2">
            <span className="font-semibold dark:text-white">
              {name.slice(0, 20)}
            </span>
            <span className="text-gray-500 flex  gap-2 dark:text-white text-[13px]">
              <span>
                {item.messageType == "CREATE"
                  ? latestMessage
                  : userLoggedIn?.id == item.sender?.userId
                  ? "You: " + latestMessage.slice(0, 15)
                  : item.type == "group"
                  ? item.sender?.username.length >= 15
                    ? item.sender?.username.slice(0, 15) +
                      "... : " +
                      latestMessage.slice(0, 10)
                    : item.sender?.username + ": " + latestMessage.slice(0, 10)
                  : latestMessage.slice(0, 10)}
              </span>

              <span>{calculateTimeDifference(messageTime)}</span>
            </span>
          </div>
        </div>
        <div className="h-10 w-10 bg-green-400 rounded-full flex items-center justify-center">
          <MdOutlineMoreHoriz
            size={20}
            className={`cursor-pointer dark:text-white`}
            onClick={(e) => {
              e.stopPropagation();
              setIsShowMenuChatItem(
                isShowMenuChatItem == "hidden" ? "block" : "hidden"
              );
            }}
          />
        </div>
        {item.type == "group" && (
          <div
            className={`flex  justify-between  absolute w-[85%] h-full top-[50%] left-[0%]  translate-y-[-50%]   ${isShowMenuChatItem} rounded-xl ${
              isDarkTheme ? " bg-slate-500" : " bg-white"
            } `}
          >
            <div
              className={`flex justify-center items-center border w-[49%] border-1   ${
                isDarkTheme
                  ? "float-neumorphism-chat-dark chat-item-dark bg-slate-500"
                  : "float-neumorphism-chat chat-item bg-white"
              } rounded-xl`}
              onClick={(e) => {
                e.stopPropagation();
                setIsShowSearchBox(true);
                setIsShowMenuChatItem("hidden");
              }}
            >
              <MdDeleteSweep size={20} className="" />
              <p>Add member</p>
            </div>
            <div
              className={`flex justify-center items-center border w-[49%] border-1   ${
                isDarkTheme
                  ? "float-neumorphism-chat-dark chat-item-dark bg-slate-500"
                  : "float-neumorphism-chat chat-item bg-white"
              } rounded-xl`}
              onClick={(e) => {
                e.stopPropagation();
                item.type == "group" &&
                  leaveGroup({
                    idChannel: item?.channelId,
                    idUser: userLoggedIn?.id,
                  });
                setIsShowMenuChatItem("hidden");
              }}
            >
              <MdDeleteSweep size={20} className="" />
              <p>Leave group</p>
            </div>
          </div>
        )}
      </div>
      <AddUserPopUp
        item={item}
        listUserToShow={listUserToShow}
        addMember={addMember}
        isShowSearchBox={isShowSearchBox}
        setIsShowSearchBox={setIsShowSearchBox}
        listUsersAdd={listUsersAdd}
        setListUsersAdd={setListUsersAdd}
        handleSearchUser={handleSearchUser}
        searchUserText={searchUserText}
        setSearchUserText={setSearchUserText}
        channelInfor={channelInfor}
        resetData={resetData}
      />
    </>
  );
};

export default ChatItem;
