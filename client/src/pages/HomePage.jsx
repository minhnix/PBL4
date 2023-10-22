import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { BiMenu } from "react-icons/bi";
import { AiOutlineSearch, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import ChatItem from "../components/ChatItem";
import { GiExitDoor } from "react-icons/gi";
import { BsCameraVideoFill } from "react-icons/bs";
import { PiUserCirclePlusLight } from "react-icons/pi";
import { RiSendPlaneFill } from "react-icons/ri";
import ChatInfo from "../components/ChatInfo";
import ChatSearchItem from "../components/ChatSearchItem";
import axios from "axios";
import { calculateTimeDifference } from "../utils/formatTime";
import Avatar from "../components/Avatar";
import { useMessage } from "../context/message.context";

const HomePage = () => {
  const { logout } = useAuth();
  const { data, fetchData, reArrangeUsersOnMessageSend, token, userLoggedIn } =
    useMessage();
  const navigate = useNavigate();
  const chatContentRef = useRef(null);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isShowAddPopup, setIsShowAddPopup] = useState(false);
  //Search infor
  const [searchChannelText, setSearchChannelText] = useState("");
  const [searchUserText, setSearchUserText] = useState("");
  //Fetch mesasge
  const [size, setSize] = useState(15);
  const [preCursor, setPreCursor] = useState("");
  const [nextCursor, setNextCursor] = useState("");
  // current channel
  const [currentChannel, setCurrentChannel] = useState({
    id: "",
    isOnline: true,
    name: "",
    messageTime: "",
  });
  //all channels haven't messages
  const [allChannels, setAllChannels] = useState([]);
  //all users
  const [users, setUsers] = useState([]);
  //users selected to create channel
  const [listUsers, setListUsers] = useState([]);
  //channel name
  const [channelName, setChannelName] = useState("");
  const [isEmptyChannelName, setIsEmptyChannelName] = useState(false);
  // Tat cac tin nhan
  const [renderMessages, setRenderMessages] = useState([]);
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState("");

  // handle getAllChannels created
  const handleGetAllChannelCreated = async () => {
    handleResetData();
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/channels/search?q=${searchChannelText}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAllChannels(res.data);
    } catch (err) {
      console.log(
        "🚀 ~ file: HomePage.jsx:95 ~ handleGetAllChannelCreated ~ err:",
        err
      );

      setRenderMessages([]);
    }
  };

  // handler get old message from current channel
  const handleGetOlderMessage = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/messages/${currentChannel.id}?size=${size}&pre=${preCursor}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setMessages([res.data.data]);
      setRenderMessages([...renderMessages, ...res.data.data]);
      setPreCursor(res.data.previousCursor);
      setNextCursor(res.data.nextCursor);
      setHasFetchedData(false);
    } catch (err) {
      console.log(
        "🚀 ~ file: HomePage.jsx:120 ~ handleGetOlderMessage ~ err:",
        err
      );
    }
  };

  // get all messages from selected channel
  const handleGetCurrentChannelMessages = async (cur) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/messages/${cur.id}?size=${size}&pre=${cur.preCursor}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRenderMessages(handerTransformMessage(res.data.data));
      setPreCursor(res.data.previousCursor);
      setNextCursor(res.data.nextCursor);
    } catch (err) {
      console.log(
        "🚀 ~ file: HomePage.jsx:142 ~ handleGetCurrentChannelMessages ~ err:",
        err
      );

      setRenderMessages([]);
    }
  };

  //Search user to create Channel
  const handleSearchUser = async (e) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/users/search?q=${e}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.log("🚀 ~ file: HomePage.jsx:163 ~ handleSearchUser ~ err:", err);

      setRenderMessages([]);
    }
  };

  const transformData = (data) => {
    const listUsersTmp = (users) => {
      return users.map((user) => user.id);
    };

    if (data.length == 1) {
      return {
        type: "pm",
        name: "",
        users: listUsersTmp([userLoggedIn, ...listUsers]),
      };
    } else if (data.length > 1) {
      return {
        type: "group",
        name: channelName,
        users: listUsersTmp([userLoggedIn, ...listUsers]),
      };
    }
    return null;
  };

  // handle create channel
  const handleCreateChannel = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/channels/create`,
        transformData(listUsers)
      );
    } catch (err) {
      console.log(
        "🚀 ~ file: HomePage.jsx:200 ~ handleCreateChannel ~ err:",
        err
      );
    }
  };

  // Scroll
  const scrollToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  };

  const handerTransformMessage = (messages) => {
    return messages.map((message) => {
      const position = message.sender === userLoggedIn.id ? "right" : "left";
      return {
        ...message,
        position,
      };
    });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = {
        position: "right",
        type: "text",
        content: inputValue,
        sender: {
          userId: userLoggedIn.id,
          username: userLoggedIn.username,
        },
        date: Date.now(),
      };
      setRenderMessages([newMessage, ...renderMessages]);
      setInputValue("");
      inputRef.current.value = "";
      scrollToBottom();
      reArrangeUsersOnMessageSend(currentChannel.id, newMessage, [
        newMessage,
        ...renderMessages,
      ]);

      // TODO: Handle send ws
    }
  };

  const handleChatItemClick = (isOnline, name, messageTime, idChannel) => {
    setCurrentChannel({
      id: idChannel,
      name: name,
      isOnline: isOnline,
      messageTime: messageTime,
    });

    handleGetCurrentChannelMessages({
      id: idChannel,
      preCursor: "",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      handleGetAllChannelCreated(searchChannelText);
    }
  };

  const handleResetData = () => {
    setRenderMessages([]);
    setCurrentChannel({ id: "", isOnline: false, name: "", messageTime: "" });
  };

  // scroll to top of message
  useEffect(() => {
    const chatContentDiv = chatContentRef.current;
    var count = 0;
    const handleScroll = () => {
      if (
        count * 200 < -1 * chatContentDiv.scrollTop &&
        preCursor != null &&
        !hasFetchedData
      ) {
        setHasFetchedData(true);
        handleGetOlderMessage();
        count++;
      }
    };
    chatContentDiv.addEventListener("scroll", handleScroll);

    return () => {
      chatContentDiv.removeEventListener("scroll", handleScroll);
    };
  }, [handleGetOlderMessage]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className={`${isDarkTheme && "dark"}`}>
        <div
          className={`w-full h-screen bg-[#ECF0F3]  flex items-center duration-300 transition-all dark:bg-[#1A1D24]`}
        >
          <div
            className={`max-w-[1440px] w-full h-[800px] bg-[#ECF0F3] dark:bg-[#1A1D24]  ${
              isDarkTheme ? "float-neumorphism-dark" : "float-neumorphism"
            } m-auto rounded-2xl flex px-4 py-2 gap-4`}
          >
            {/* Sidebar */}
            <div
              className={`flex flex-col w-[60px] h-full items-center justify-between ${
                isDarkTheme ? "float-neumorphism-dark" : "float-neumorphism"
              }  rounded-lg py-3`}
            >
              <Avatar name={userLoggedIn.username} size={10} />
              <div className="px-1 py-1 cursor-pointer relative">
                <BiMenu
                  size={24}
                  className={`${isDarkTheme && "text-white"} hover:opacity-60 `}
                  onClick={() => setIsShowMenu(!isShowMenu)}
                />
                {isShowMenu && (
                  <div
                    className={`absolute w-[150px] h-[50px] bg-white dark:bg-[#2D323D] dark:text-white rounded-full top-[-180%] left-[-160%] z-50 flex items-center justify-center  shadow-xl`}
                  >
                    <div
                      className="w-[70%] h-[70%] rounded-full hover:bg-[#ECF0F3] dark:hover:bg-[#1A1D24] flex items-center justify-center gap-2"
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
                  } dark:bg-[#1A1D24] bg-white relative cursor-pointer`}
                  onClick={() => setIsDarkTheme(!isDarkTheme)}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-[#1A1D24] dark:bg-[#A2B6FF] absolute top-[15%] ${
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
                } deep-neumorphism bg-[#ECF0F3] dark:bg-[#1A1D24] rounded-full flex items-center justify-between`}
              >
                <div className="flex items-center px-2 py-2 gap-2">
                  <AiOutlineSearch
                    size={20}
                    className={`text-[#1A1D24] dark:text-white`}
                    onClick={() => {
                      handleGetAllChannelCreated(searchChannelText);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search Messenger"
                    className={`text-gray-700 placeholder-[#495FB8] dark:text-white bg-transparent text-sm outline-none`}
                    onChange={(e) => setSearchChannelText(e.target.value)}
                    onKeyDown={(e) => handleSearch(e)}
                  ></input>
                </div>
              </div>
              <div
                className={`flex flex-col gap-3 h-[600px] overflow-x-hidden overflow-y-auto no-scrollbar w-full bg-transparent ${
                  isDarkTheme && "deep-neumorphism-dark"
                } deep-neumorphism rounded-xl px-4 py-3`}
              >
                {searchChannelText != ""
                  ? allChannels.map((item, index) => (
                      <ChatSearchItem
                        isDarkTheme={isDarkTheme}
                        channelName={item.channelName}
                        channelId={item.channelId}
                        onClick={() => {
                          setCurrentChannel({
                            id: item.channelId,
                            isOnline: true,
                            name: item.channelName,
                            messageTime: "",
                          });
                          handleGetCurrentChannelMessages({
                            id: item.channelId,
                            isOnline: true,
                            name: item.channelName,
                            preCursor: "",
                          });
                        }}
                        key={index}
                      />
                    ))
                  : data.map((item, index) => (
                      <ChatItem
                        isDarkTheme={isDarkTheme}
                        name={item.channelName}
                        messageTime={item.createdAt}
                        isOnline={item.online}
                        latestMessage={item.latestMessage}
                        sender={item.sender}
                        userLoggedIn={userLoggedIn}
                        onClick={() => {
                          handleChatItemClick(
                            item.online,
                            item.channelName,
                            item.createdAt,
                            item.channelId
                          );
                        }}
                        key={index}
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
                  onClick={(e) => {
                    setIsShowAddPopup(true);
                  }}
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
              className={`h-full w-[1000px] flex flex-col justify-between  py-2 px-2 bg-[#ECF0F3] dark:bg-[#1A1D24]`}
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
                    idChannel={currentChannel.id}
                    isOnline={currentChannel.isOnline}
                    messageTime={currentChannel.messageTime}
                    name={currentChannel.name}
                  />
                </div>
                <div className="w-[40px] flex items-center justify-center">
                  <button
                    className={` w-[40px] h-[40px] rounded-full cursor-pointer feature-btn ${
                      isDarkTheme
                        ? "float-neumorphism-chat-dark feature-btn-dark"
                        : "float-neumorphism-chat feature-btn"
                    } flex items-center justify-center text-[#495FB8]`}
                  >
                    <BsCameraVideoFill size={20} />
                  </button>
                </div>
              </div>
              <div
                className={`w-full h-[500px] relative rounded-lg px-2 py-2 my-4 flex-1  ${
                  isDarkTheme
                    ? "deep-neumorphism-item-dark"
                    : "deep-neumorphism-item"
                } `}
              >
                <div
                  className=" flex flex-col gap-3 overflow-auto overflow-x-hidden h-full py-4  "
                  id="chatContent"
                  ref={chatContentRef}
                  style={{ flexDirection: "column-reverse" }}
                >
                  {currentChannel.name != "" ? (
                    renderMessages?.map((message) =>
                      message.sender.userId != userLoggedIn.id ? (
                        <div className="flex items-center gap-2 ml-2">
                          {message.sender.userId !== userLoggedIn.id && (
                            <Avatar name={message.sender.username} size={10} />
                          )}
                          <p
                            className={`left-chat float-left break-all bg-white dark:bg-[#1A1D24] dark:text-white ${
                              isDarkTheme && "float-neumorphism-chat-dark"
                            } float-neumorphism-chat px-2 py-2 max-w-sm whitespace-normal flex items-center justify-center rounded text-sm`}
                          >
                            {message.content}
                            <div className="left-chat-tooltip text-white bg-gray-400 dark:bg-white dark:text-gray-500 min-w-12 px-2 h-8 absolute left-[120%] text-sm top-[50%] translate-y-[-50%] flex items-center justify-center rounded -z-10">
                              <span>
                                {calculateTimeDifference(message.createdAt)}
                              </span>
                            </div>
                          </p>
                        </div>
                      ) : (
                        <div className="">
                          <p
                            className={`relative mr-4 right-chat float-right break-all bg-[#8090CB] text-white float-neumorphism-chatBox px-2 py-2 max-w-sm whitespace-normal rounded flex items-center justify-center text-sm`}
                          >
                            {message.content}
                            <div className="right-chat-tooltip bg-gray-400 min-w-12 dark:bg-white dark:text-gray-500 px-2 h-8 absolute right-[120%] text-sm top-[50%] translate-y-[-50%] flex items-center justify-center rounded -z-10">
                              <span>
                                {calculateTimeDifference(message.createdAt)}
                              </span>
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
          } transition-all duration-300 linear w-[500px] h-[500px] rounded-xl bg-white dark:bg-[#2D323D] flex flex-col shadow-2xl`}
        >
          <div
            className={`w-full flex items-center justify-center py-4 relative dark:text-white`}
          >
            <p className={` font-semibold`}>New Message</p>
            <div>
              <AiOutlineClose
                size={16}
                className={`absolute top-[35%] right-2 cursor-pointer `}
                onClick={(e) => {
                  setIsShowAddPopup(false);
                  setListUsers([]);
                  setUsers([]);
                }}
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
              onChange={(e) => {
                setSearchUserText(e.target.value);
                handleSearchUser(e.target.value);
              }}
            />
          </div>
          <div className="w-full h-[400px] px-2 pt-2">
            <div className="flex flex-col gap-4 text-sm dark:text-white h-[200px] overflow-auto">
              {searchUserText != "" &&
                users?.map((item, index) => (
                  <div
                    className="bg-red py-2 px-4 w-min flex gap-4 
                items-center border border-black rounded-full cursor-pointer"
                    onClick={() => {
                      if (!listUsers.some((user) => user.id === item.id)) {
                        setListUsers([...listUsers, item]);
                      }
                    }}
                  >
                    {item.username}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex gap-4 text-sm dark:text-white h-[100px] overflow-auto px-4 border-t-2 border-gray-400 pt-2">
            {listUsers?.map((item, index) => (
              <div
                className="bg-red py-2 px-4 w-min flex gap-2 h-8
                items-center border border-black rounded-full cursor-pointer "
              >
                {item.username}
                <div>
                  <AiOutlineClose
                    size={16}
                    onClick={() =>
                      setListUsers(
                        listUsers.filter((user) => user.id != item.id)
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 my-2">
            {listUsers.length > 1 && (
              <div>
                <label className="px-2">Name group</label>
                <input
                  type="text"
                  required
                  placeholder="Enter name group chat"
                  className="px-2 border border-radius-4 border-black h-6 rounded-lg outline-none"
                  onChange={(e) => {
                    setChannelName(e.target.value);
                  }}
                />
              </div>
            )}
            {isEmptyChannelName && listUsers.length > 1 && (
              <span className="text-red-500 font-medium text-sm px-4">
                Username must be not empty!.
              </span>
            )}
          </div>
          <div className="w-full h-24 px-2 py-2 border-t-slate-200 ">
            <button
              className={`w-full h-full bg-[#8090CB] hover:opacity-60 text-white font-semibold rounded-lg flex items-center justify-center`}
              onClick={() => {
                if (channelName.trim() === "") {
                  if (listUsers.length == 1) {
                    handleCreateChannel();
                    setIsShowAddPopup(false);
                  } else {
                    setIsEmptyChannelName(true);
                  }
                } else {
                  setIsEmptyChannelName(false);
                  handleCreateChannel();
                  setIsShowAddPopup(false);
                }
              }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
