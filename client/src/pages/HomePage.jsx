import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import RecievedCallPopup from "../components/RecievedCallPopUp";
import Menu from "../components/VideoCallMenu";
import { BiMenu } from "react-icons/bi";
import Loader from "../components/Loader";
import Avatar from "../components/Avatar";
import { GiExitDoor } from "react-icons/gi";
import { useStomp } from "usestomp-hook/lib";
import ChatInfo from "../components/ChatInfo";
import ChatItem from "../components/ChatItem";
import { useNavigate } from "react-router-dom";
import { RiSendPlaneFill } from "react-icons/ri";
import { useAuth } from "../context/auth.context";
import { BsCameraVideoFill } from "react-icons/bs";
import MessageSend from "../components/MessageSend";
import { PiUserCirclePlusLight } from "react-icons/pi";
import MessageCenter from "../components/MessageCenter";
import { useMessage } from "../context/message.context";
import ChatSearchItem from "../components/ChatSearchItem";
import { StompContext } from "usestomp-hook/lib/Provider";
import MessageReceived from "../components/MessageReceived";
import { AiOutlineSearch, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

const HomePage = () => {
  const { logout } = useAuth();
  const token = localStorage.getItem("token");
  const client = useContext(StompContext).stompClient;
  const { send } = useStomp();
  const {
    data,
    fetchData,
    reArrangeUsersOnMessageSend,
    userLoggedIn,
    newMessage,
    setNewMessage,
  } = useMessage();
  const navigate = useNavigate();
  const chatContentRef = useRef(null);
  const [status, setStatus] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isShowAddPopup, setIsShowAddPopup] = useState(false);
  //Search infor
  const [searchChannelText, setSearchChannelText] = useState("");
  const [searchUserText, setSearchUserText] = useState("");
  //Fetch mesasge
  const loaderRef = useRef(null);
  const [size, setSize] = useState(15);
  const [preCursor, setPreCursor] = useState("");
  const [nextCursor, setNextCursor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let isOnline = false;

  // current channel
  const [currentChannel, setCurrentChannel] = useState({
    id: "",
    isOnline: true,
    name: "",
    messageTime: "",
    userId: null,
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

  const fetchMessage = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    if (currentChannel.id != "") await handleGetOlderMessage();

    setIsLoading(false);
  }, [isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        fetchMessage();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [preCursor, fetchMessage]);

  // handle getAllChannels created
  const handleGetAllChannelCreated = async (e) => {
    setSearchChannelText(e.target.value);
    if (e.target.value == "") handleResetData();
    else {
      // e.preventDefault();
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/channels/search?q=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllChannels(res.data);
        console.log(
          "🚀 ~ file: HomePage.jsx:121 ~ handleGetAllChannelCreated ~ res:",
          res
        );
      } catch (err) {
        console.log(
          "🚀 ~ file: HomePage.jsx:95 ~ handleGetAllChannelCreated ~ err:",
          err
        );
        setRenderMessages([]);
      }
    }
  };

  // handler get old message from current channel
  const handleGetOlderMessage = async () => {
    if (preCursor)
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/messages/${currentChannel.id}?size=${size}&pre=${preCursor}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRenderMessages([...renderMessages, ...res.data.data]);
        setPreCursor((pre) => res.data.previousCursor);
        setNextCursor(res.data.nextCursor);
      } catch (err) {
        console.log(
          "🚀 ~ file: HomePage.jsx:120 ~ handleGetOlderMessage ~ err:",
          err
        );
      }
  };

  // get all messages from selected channel
  const handleGetCurrentChannelMessages = async (cur) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/messages/${cur.id}?size=${size}&pre=${cur.preCursor}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRenderMessages(res.data.data);
      setPreCursor(res.data.previousCursor);
      setNextCursor(res.data.nextCursor);
    } catch (err) {
      console.log(
        "🚀 ~ file: HomePage.jsx:142 ~ handleGetCurrentChannelMessages ~ err:",
        err
      );

      setRenderMessages([]);
    }
    setIsLoading(false);
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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const newSendMessage = {
        position: "right",
        type: "MESSAGE",
        content: inputValue,
        sender: {
          userId: userLoggedIn?.id,
          username: userLoggedIn?.username,
        },
        sendTo: currentChannel.userId ? currentChannel.userId : null,
        channelId: currentChannel.id,
      };
      setInputValue("");
      inputRef.current.value = "";
      scrollToBottom();
      if (currentChannel.userId) {
        send("/app/chat/pm", newSendMessage, {});
      } else {
        send(`/app/chat/group/${currentChannel.id}`, newSendMessage, {});
      }
    }
  };

  const handleChatItemClick = (
    isOnline,
    name,
    messageTime,
    idChannel,
    userId
  ) => {
    setCurrentChannel({
      id: idChannel,
      name: name,
      isOnline: isOnline,
      messageTime: messageTime,
      userId,
    });

    handleGetCurrentChannelMessages({
      id: idChannel,
      preCursor: "",
      userId,
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
    setCurrentChannel({
      id: "",
      isOnline: false,
      name: "",
      messageTime: "",
      userId: null,
    });
    setPreCursor("");
  };

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }
  }, []);

  const subscribe = (client, path) => {
    client.subscribe(
      path,
      ({ body }) => {
        const message = JSON.parse(body);
        if (message.type == "CREATE") {
          const path = "/topic/group/" + message.channelId;
          subscribe(client, path);
        }
        setNewMessage(message);
      },
      {
        Authorization: "Bearer " + token,
      }
    );
  };

  const subscribeUserChatPM = (client) => {
    const path = `/user/${userLoggedIn.id}/pm`;
    subscribe(client, path);
  };

  const getGroupsOfUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/channels?type=group`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (err) {
      console.log("🚀 ~ getGroupOfUser ~ err:", err);
    }
  };

  const subscribeGroupChat = async (client) => {
    const groups = await getGroupsOfUser();
    if (groups == null) return;
    groups.forEach((group) => {
      const path = "/topic/group/" + group;
      subscribe(client, path);
    });
  };

  useEffect(() => {
    client.onConnect = () => {
      subscribeUserChatPM(client);
      subscribeGroupChat(client);
    };
  }, [client]);

  useEffect(() => {
    if (newMessage == null) return;
    reArrangeUsersOnMessageSend(newMessage.channelId, newMessage);
    if (newMessage.channelId === currentChannel.id) {
      setRenderMessages((pre) => [newMessage, ...pre]);
    }
  }, [newMessage]);

  const handleOnlineStatus = () => {
    isOnline = true;
  };

  useEffect(() => {
    if (userLoggedIn == null) window.location.reload();
    console.log(
      "🚀 ~ file: HomePage.jsx:398 ~ useEffect ~ userLoggedIn:",
      userLoggedIn
    );
    fetchData();

    document.addEventListener("mousemove", handleOnlineStatus);
    document.addEventListener("click", handleOnlineStatus);
    document.addEventListener("keydown", handleOnlineStatus);

    return () => {
      document.removeEventListener("mousemove", handleOnlineStatus);
      document.removeEventListener("click", handleOnlineStatus);
      document.removeEventListener("keydown", handleOnlineStatus);
    };
  }, []);

  const sendStatusToServer = () => {
    send("/app/heartbeat-online", {}, {});
  };

  useEffect(() => {
    const intervalFetch = setInterval(() => {
      userLoggedIn ? fetchData() : null;
    }, 2 * 60 * 1000);

    return () => clearInterval(intervalFetch);
  }, []);

  useEffect(() => {
    const intervalSend = setInterval(() => {
      if (isOnline && userLoggedIn) {
        sendStatusToServer();
        isOnline = false;
      }
    }, 5000);

    return () => clearInterval(intervalSend);
  }, []);
  // Video call

  const [currentPage, setCurrentPage] = useState("home");
  const [isAnswer, setAnswer] = useState(true);

  const handleCloseCallPopup = () => {
    setAnswer(false);
  };

  //end
  if (token == null) return <div></div>;
  return (
    <>
      <RecievedCallPopup
        name={"Buoi Hoang Minh"}
        callId={"Jv64hB17xbrEU8pJYuDZ"}
        status={status}
        setStatus={setStatus}
      />
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
              <Avatar name={userLoggedIn?.username} size={10} />
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
                      handleGetAllChannelCreated(e);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search Messenger"
                    className={`text-gray-700 placeholder-[#495FB8] dark:text-white bg-transparent text-sm outline-none`}
                    onChange={(e) => handleGetAllChannelCreated(e)}
                    // onKeyDown={(e) => handleSearch(e)}
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
                            userId: item.userId,
                          });
                          handleGetCurrentChannelMessages({
                            id: item.channelId,
                            isOnline: true,
                            name: item.channelName,
                            preCursor: "",
                            userId: item.userId,
                          });
                        }}
                        key={index}
                      />
                    ))
                  : data.map((item, index) => (
                      <ChatItem
                        item={item}
                        isDarkTheme={isDarkTheme}
                        name={item.channelName}
                        messageTime={item.createdAt}
                        isOnline={item.online}
                        latestMessage={item.latestMessage}
                        userLoggedIn={userLoggedIn}
                        onClick={() => {
                          handleChatItemClick(
                            item.online,
                            item.channelName,
                            item.createdAt,
                            item.channelId,
                            item?.userId
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
                    {/* <BsCameraVideoFill size={20} /> */}
                    <div className="w-[40px] flex items-center justify-center">
                      <Menu
                        setPage={setCurrentPage}
                        isDarkTheme={isDarkTheme}
                        isAnswer={false}
                      />
                    </div>
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
                      message.type == "CREATE" ? (
                        <MessageCenter
                          key={message?.id}
                          messageType={message?.type}
                          content={message?.content}
                        />
                      ) : message.sender.userId != userLoggedIn.id ? (
                        <MessageReceived
                          key={message?.id}
                          isDarkTheme={isDarkTheme}
                          content={message?.content}
                          username={message?.sender.username}
                          createdAt={message?.createdAt}
                        />
                      ) : (
                        <MessageSend
                          key={message?.id}
                          createdAt={message?.createdAt}
                          content={message?.content}
                        />
                      )
                    )
                  ) : (
                    <div className="flex flex-col justify-center h-full items-center gap-4">
                      <span>Select Channel to Show Messages</span>
                      <img
                        className="w-[400px] h-[400px]"
                        src="https://i.redd.it/rwhpkq916y3z.jpg"
                        alt="Nothing"
                      />
                    </div>
                  )}
                  {currentChannel.id != "" && (
                    <div ref={loaderRef}>{isLoading && <Loader />}</div>
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
          } transition-all duration-300 linear w-[400px] h-[450px] rounded-xl bg-white dark:bg-[#2D323D] flex flex-col shadow-2xl`}
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
                  setIsEmptyChannelName(false);
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
          {/* list user after search */}
          <div className="w-full h-[400px] px-2 pt-2">
            <div className="flex flex-col gap-4  mt-4 text-sm dark:text-white h-[200px] overflow-auto">
              {searchUserText !== "" &&
                users?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-red py-2 px-4 w-[80%] mx-auto flex justify-between gap-4 items-center border border-black rounded-md cursor-pointer"
                    onClick={() => {
                      const checkbox = document.querySelector(
                        `#${item.username}`
                      );
                      if (checkbox && checkbox.checked == true) {
                        checkbox.checked = false;
                        setListUsers(
                          listUsers.filter((user) => user.id != item.id)
                        );
                      } else {
                        checkbox.checked = true;
                        setListUsers([...listUsers, item]);
                      }
                    }}
                  >
                    {item?.username}
                    <input
                      type="checkbox"
                      name="listUser"
                      id={item.username}
                      value={item}
                    />
                  </div>
                ))}
            </div>
          </div>
          {/* Name group */}
          <div className="flex flex-col gap-2 my-2">
            {listUsers.length > 1 && (
              <div>
                <label className="px-2">Name group</label>
                <input
                  type="text"
                  required
                  placeholder="Enter name group chat"
                  className="px-2 py-2 border border-radius-4 border-black h-6 rounded-md outline-none"
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
          <div className="w-full h-20 px-2 py-2 border-t-slate-200 ">
            <button
              className={`w-full h-12 bg-[#8090CB] hover:opacity-60 text-white font-semibold rounded-lg flex items-center justify-center`}
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
