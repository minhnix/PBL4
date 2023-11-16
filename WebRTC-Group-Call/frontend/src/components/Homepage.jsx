import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { AiOutlineSearch, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { BsCameraVideoFill } from "react-icons/bs";
import socket from "../socket";
import ChatItem from "../components/ChatItem";
import { GiExitDoor } from "react-icons/gi";
import { PiUserCirclePlusLight } from "react-icons/pi";
import { RiSendPlaneFill } from "react-icons/ri";
import ChatInfo from "../components/ChatInfo";
import { formatMessageTime } from "../utils/formatTime";

const HomePage = () => {
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isShowAddPopup, setIsShowAddPopup] = useState(false);
  const [currentChatUser, setCurrentChatUser] = useState({
    isOnline: false,
    name: "",
    messageTime: "",
  });
  const data = [
    {
      name: "John",
      isOnline: true,
      messageTime: "Now",
    },
    {
      name: "Alice",
      isOnline: false,
      messageTime: "5 minutes ago",
    },
    {
      name: "Bob",
      isOnline: true,
      messageTime: "2 hours ago",
    },
    {
      name: "Emily",
      isOnline: false,
      messageTime: "1 day ago",
    },
  ];
  const [messages, setMessages] = useState([
    {
      sender: 1,
      text: "kakak",
      time: "Monday 5:12pm",
      date: new Date(),
    },
    {
      sender: "user1",
      text: "Hello",
      time: "Monday 5:12pm",
      date: new Date(),
    },
  ]);
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState("");
  const renderMessages = messages.map((message) => {
    const position = message.sender === 1 ? "right" : "left";
    return {
      ...message,
      position,
      text: message.text,
    };
  });

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = {
        position: "left",
        type: "text",
        text: inputValue,
        sender: 1,
        date: new Date(),
      };

      setMessages([...messages, newMessage]);
      setInputValue("");
      inputRef.current.value = "";
    }
  };
  const handleChatItemClick = (isOnline, name, messageTime) => {
    setCurrentChatUser({
      name: name,
      isOnline: isOnline,
      messageTime: messageTime,
    });
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  const channelId = "1";
  const callerId = "3";
  useEffect(() => {
    socket.on("FE-error-user-exist", ({ error }) => {
      if (!error) {
        sessionStorage.setItem("user", callerId);
        navigate(`/room/${channelId}`);
      } else {
        setErr(error);
        setErrMsg("User name already exist");
      }
    });
  }, []);
  function clickJoin() {
    socket.emit("BE-check-user", { roomId: channelId, userName: callerId });
  }

  return (
    <>
      <div className={`${isDarkTheme && "dark"}`}>
        <div
          className={`w-full h-screen bg-[#ECF0F3] flex items-center duration-300 transition-all `}
        >
          <div
            className={`max-w-[1440px] w-full h-[800px] bg-[#ECF0F3]   ${
              isDarkTheme ? "float-neumorphism-dark" : "float-neumorphism"
            } m-auto rounded-2xl flex px-4 py-2 gap-4`}
          >
            {/* Sidebar */}
            <div
              className={`flex flex-col w-[60px] h-full items-center justify-between ${
                isDarkTheme ? "float-neumorphism-dark" : "float-neumorphism"
              }  rounded-lg py-3`}
            >
              <div>
                <span className="w-[40px] h-[40px] rounded-full bg-red-400 block"></span>
              </div>
              <div className="px-1 py-1 cursor-pointer relative">
                <BiMenu
                  size={24}
                  className={`${isDarkTheme && "text-white"} hover:opacity-60 `}
                  onClick={() => setIsShowMenu(!isShowMenu)}
                />
                {isShowMenu && (
                  <div
                    className={`absolute w-[150px] h-[50px] bg-white  dark:text-white rounded-full top-[-180%] left-[-160%] z-50 flex items-center justify-center  shadow-xl`}
                  >
                    <div
                      className="w-[70%] h-[70%] rounded-full hover:bg-[#ECF0F3] flex items-center justify-center gap-2"
                      onClick={() => {
                        logout();
                        navigate("/signin");
                      }}
                    >
                      <GiExitDoor size={20} className={`text-[#8090CB]`} />
                      <span className="font-semibold">Logout</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Left */}
            <div className="w-[380px] h-full rounded-lg py-3 px-4 flex flex-col items-center gap-4">
              <div
                className={`w-[50%] h-12  ${
                  isDarkTheme ? "float-neumorphism-dark" : "float-neumorphism"
                } flex items-center justify-center gap-2 px-2 py-1 rounded`}
              >
                <div
                  className={`w-14 h-7 rounded-full ${
                    isDarkTheme ? "deep-neumorphism-dark" : "deep-neumorphism"
                  }  bg-white relative cursor-pointer`}
                  onClick={() => setIsDarkTheme(!isDarkTheme)}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-[#1A1D24]  absolute top-[15%] ${
                      isDarkTheme ? "right-7" : "right-2"
                    }  duration-300 transition-all `}
                  ></span>
                </div>
                <div>
                  <span
                    className={`font-bold text-2xl ${
                      isDarkTheme && "text-[#ECF0F3] title-neumorphism-dark"
                    } text-[#1A1D24]`}
                  >
                    CHATS
                  </span>
                </div>
              </div>
              <div
                className={`w-full h-8 ${
                  isDarkTheme && "deep-neumorphism-dark"
                } deep-neumorphism bg-[#ECF0F3]  rounded-full flex items-center justify-between`}
              >
                <div className="flex items-center px-2 py-2 gap-2">
                  <AiOutlineSearch size={20} className={`text-[#1A1D24] `} />
                  <input
                    type="text"
                    placeholder="Search Messenger"
                    className={`text-gray-700 placeholder-[#495FB8]  bg-transparent text-sm outline-none`}
                  ></input>
                </div>
              </div>
              <div
                className={`flex flex-col gap-3 h-[600px] overflow-x-hidden overflow-y-auto no-scrollbar w-full bg-transparent ${
                  isDarkTheme && "deep-neumorphism-dark"
                } deep-neumorphism rounded-xl px-4 py-3`}
              >
                {data.map((item, index) => (
                  <ChatItem
                    isDarkTheme={isDarkTheme}
                    name={item.name}
                    messageTime={item.messageTime}
                    isOnline={item.isOnline}
                    key={index}
                    onClick={() =>
                      handleChatItemClick(
                        item.isOnline,
                        item.name,
                        item.messageTime
                      )
                    }
                  />
                ))}
              </div>
              <div className="w-full flex items-center justify-center">
                <button
                  className={`w-[50%] h-14 rounded-xl ${
                    isDarkTheme
                      ? "float-neumorphism-dark addChat-btn-dark"
                      : "float-neumorphism addChat-btn"
                  } flex gap-2 items-center justify-center`}
                  onClick={(e) => setIsShowAddPopup(true)}
                >
                  <PiUserCirclePlusLight
                    size={24}
                    className={`text-[#8090CB]`}
                  />
                  <span className={`font-semibold text-sm  dark:text-white`}>
                    Add new chat
                  </span>
                </button>
              </div>
            </div>
            {/* Right */}
            <div
              className={`h-full w-[1000px] flex flex-col gap-2 py-2 px-2 bg-[#ECF0F3] `}
            >
              <div
                className={`w-full h-[80px] flex gap-2 px-2 py-2 rounded-lg ${
                  isDarkTheme ? "float-neumorphism-dark" : "float-neumorphism"
                } `}
              >
                <div
                  className={`w-full rounded-lg ${
                    isDarkTheme
                      ? "deep-neumorphism-item-dark"
                      : "deep-neumorphism-item"
                  } `}
                >
                  <ChatInfo
                    isDarkTheme={isDarkTheme}
                    isOnline={currentChatUser.isOnline}
                    messageTime={currentChatUser.messageTime}
                    name={currentChatUser.name}
                  />
                </div>
                <div className="w-[40px] flex items-center justify-center">
                  <button
                    className={` w-[40px] h-[40px] rounded-full cursor-pointer active:deep-neumorphism-item  ${
                      isDarkTheme
                        ? "float-neumorphism-chat-dark feature-btn-dark"
                        : "float-neumorphism-chat feature-btn"
                    } flex items-center justify-center text-[#495FB8]`}
                    onClick={handleSendMessage}
                  >
                    <BsCameraVideoFill onClick={clickJoin} size={20} />
                  </button>
                </div>
              </div>
              <div
                className={`w-full h-[730px] relative rounded-lg px-2 py-2  ${
                  isDarkTheme
                    ? "deep-neumorphism-item-dark"
                    : "deep-neumorphism-item"
                } `}
              >
                <div className="mt-4 flex flex-col gap-3">
                  {currentChatUser.name !== "" ? (
                    renderMessages.map((message) =>
                      message.sender !== 1 ? (
                        <div className="flex items-center gap-2">
                          {message.sender !== 1 && (
                            <span className="w-10 h-10 rounded-full block bg-red-300"></span>
                          )}
                          <p
                            className={`left-chat float-left break-all bg-white  dark:text-white ${
                              isDarkTheme && "float-neumorphism-chat-dark"
                            } float-neumorphism-chat px-2 py-2 max-w-sm whitespace-normal flex items-center justify-center rounded text-sm`}
                          >
                            {message.text}
                            <div className="left-chat-tooltip text-white bg-gray-400 dark:bg-white dark:text-gray-500 min-w-12 px-2 h-8 absolute left-[120%] text-sm top-[50%] translate-y-[-50%] flex items-center justify-center rounded -z-10">
                              <span>{formatMessageTime(message.date)}</span>
                            </div>
                          </p>
                        </div>
                      ) : (
                        <div className="">
                          <p
                            className={`relative right-chat float-right break-all bg-[#8090CB] text-white float-neumorphism-chatBox px-2 py-2 max-w-sm whitespace-normal rounded flex items-center justify-center text-sm`}
                          >
                            {message.text}
                            <div className="right-chat-tooltip bg-gray-400 min-w-12 dark:bg-white dark:text-gray-500 px-2 h-8 absolute right-[120%] text-sm top-[50%] translate-y-[-50%] flex items-center justify-center rounded -z-10">
                              <span>{formatMessageTime(message.date)}</span>
                            </div>
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <span>Select to Chat</span>
                  )}
                </div>
              </div>
              <div
                className={`w-full h-[64px]  flex items-center px-2 py-2 gap-2 rounded-lg ${
                  isDarkTheme
                    ? "float-neumorphism-chat-dark"
                    : "float-neumorphism-chat"
                }`}
              >
                <div className="w-[40px] flex items-center justify-center">
                  <button
                    className={` w-[40px] h-[40px] rounded-full cursor-pointer feature-btn ${
                      isDarkTheme
                        ? "float-neumorphism-chat-dark feature-btn-dark"
                        : "float-neumorphism-chat feature-btn"
                    } flex items-center justify-center text-[#495FB8]`}
                  >
                    <AiOutlinePlus size={20} />
                  </button>
                </div>
                <input
                  className={`${
                    isDarkTheme
                      ? "deep-neumorphism-item-dark"
                      : "deep-neumorphism-item"
                  } w-full h-full rounded-lg deep-neumorphism-item outline-none px-4 text-sm text-gray-700 placeholder-[#495FB8] dark:text-white bg-transparent`}
                  placeholder="Type Message"
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  ref={inputRef}
                ></input>
                <div className="w-[40px] flex items-center justify-center">
                  <button
                    className={` w-[40px] h-[40px] rounded-full cursor-pointer active:deep-neumorphism-item  ${
                      isDarkTheme
                        ? "float-neumorphism-chat-dark feature-btn-dark"
                        : "float-neumorphism-chat feature-btn"
                    } flex items-center justify-center text-[#495FB8]`}
                    onClick={handleSendMessage}
                  >
                    <RiSendPlaneFill size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`absolute flex ${
            isShowAddPopup
              ? "opacity-100 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
              : "opacity-0 top-[-100%] translate-x-[-50%] translate-y-[-50%] left-[50%]"
          } transition-all duration-300 linear w-[500px] h-[300px] rounded-xl bg-white dark:bg-[#2D323D] flex flex-col shadow-2xl`}
        >
          <div
            className={`w-full flex items-center justify-center py-4 relative dark:text-white`}
          >
            <p className={` font-semibold`}>New Message</p>
            <div>
              <AiOutlineClose
                size={16}
                className={`absolute top-[35%] right-2 cursor-pointer `}
                onClick={() => setIsShowAddPopup(false)}
              />
            </div>
          </div>
          <div
            className={`w-full flex gap-2 px-2 py-2 border-y border-gray-300 dark:text-white`}
          >
            <span>To:</span>
            <input
              type="text"
              placeholder="Search Username or Email"
              className={`outline-none placeholder-gray-500 w-full text-sm bg-transparent `}
            />
          </div>
          <div className="w-full h-[300px] px-2 py-2">
            <span className="text-sm dark:text-white">Nothing Found</span>
          </div>
          <div className="w-full h-24 px-2 py-2 ">
            <button
              className={`w-full h-full bg-[#8090CB] hover:opacity-60 text-white font-semibold rounded-lg flex items-center justify-center`}
            >
              Chat
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
