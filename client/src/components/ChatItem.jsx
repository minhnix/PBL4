import axios from "axios";
import Avatar from "./Avatar";
import AddUserPopUp from "./AddUserPopUp";
import { GiExitDoor } from "react-icons/gi";
import React, { useState, useEffect } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { calculateTimeDifference } from "../utils/formatTime";
import { SERVER_URL } from "../config";
const ChatItem = ({
  item,
  isDarkTheme,
  name,
  messageTime,
  isOnline,
  latestMessage,
  userLoggedIn,
  onClick,
  setCurrentChannelId,
  leaveGroup,
  addMember,
}) => {
  const [isShowMenuChatItem, setIsShowMenuChatItem] = useState(false);
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
      const res = await axios.get(`${SERVER_URL}/api/v1/users/search?q=${e}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        `${SERVER_URL}/api/v1/channels/${item?.channelId}`,
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
        className={`relative w-full h-16 cursor-pointer ${
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
            <span className="font-semibold dark:text-white">{name}</span>
            <span className="text-gray-500 flex  gap-2 dark:text-white text-[13px]">
              <span>
                {item.messageType == "CREATE" ||
                item.messageType == "JOIN" ||
                item.messageType == "LEAVE" ||
                !item.messageType
                  ? latestMessage.slice(0, 25) + "..."
                  : item.type == "group"
                  ? userLoggedIn?.id == item.sender?.userId
                    ? "You: " + latestMessage.slice(0, 15)
                    : item.sender?.username + ": " + latestMessage.slice(0, 15)
                  : userLoggedIn?.id == item.sender?.userId
                  ? "You: " + latestMessage.slice(0, 15)
                  : latestMessage.slice(0, 15)}
              </span>

              <span>{calculateTimeDifference(messageTime)}</span>
            </span>
          </div>
        </div>
        <div className="h-10 w-10 hover:bg-neutral-300  rounded-full flex items-center justify-center">
          <MdOutlineMoreHoriz
            size={20}
            className={`cursor-pointer dark:text-white`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentChannelId(item.channelId);
              setIsShowMenuChatItem(!isShowMenuChatItem);
            }}
          />
        </div>
        {item.type == "group" && isShowMenuChatItem && (
          <div className="absolute flex flex-col gap-4 items-start w-[60%] px-4 py-4 justify-between bg-white border border-gray-500/50 right-8 top-[65px] z-10 rounded-lg shadow-xl">
            <button
              className=" hover:font-bold flex gap-2 items-center text-base "
              onClick={(e) => {
                e.stopPropagation();
                setIsShowSearchBox(true);
                setIsShowMenuChatItem(!isShowMenuChatItem);
                handleGetInforChannel();
              }}
            >
              <AiOutlineUsergroupAdd size={24} /> <span>Add new member</span>
            </button>
            <div className="h-[1px] w-[100%] bg-gray-500/50"></div>
            <button
              className="hover:font-bold flex gap-2 items-center text-base "
              onClick={(e) => {
                e.stopPropagation();
                item.type == "group" &&
                  leaveGroup({
                    idChannel: item?.channelId,
                    idUser: userLoggedIn?.id,
                  });
                setIsShowMenuChatItem(!isShowMenuChatItem);
              }}
            >
              <GiExitDoor size={24} /> <span>Leave Group</span>
            </button>
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
