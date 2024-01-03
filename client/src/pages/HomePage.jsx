import { useRef, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
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
import MessageSend from "../components/MessageSend";
import { PiUserCirclePlusLight } from "react-icons/pi";
import MessageCenter from "../components/MessageCenter";
import { useMessage } from "../context/message.context";
import ChatSearchItem from "../components/ChatSearchItem";
import SearchUserPopUp from "../components/SearchUserPopUp";
import { StompContext } from "usestomp-hook/lib/Provider";
import VideoCallButton from "../components/VideoCallButton";
import MessageReceived from "../components/MessageReceived";
import ReceivedCallPopup from "../components/ReceivedCallPopUp";
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import Popup from "../components/Popup";
import { SERVER_URL } from "../config";
import SendFilePopUp from "../components/SendFilePopUp";

const HomePage = () => {
  const currentChannelIdRef = useRef("");
  const { logout } = useAuth();
  const token = localStorage.getItem("token");
  const client = useContext(StompContext).stompClient;
  const { send, subscribe, unsubscribe } = useStomp();
  const {
    data,
    setData,
    fetchData,
    reArrangeUsersOnMessageSend,
    userLoggedIn,
    newMessage,
    setNewMessage,
  } = useMessage();
  const navigate = useNavigate();
  const chatContentRef = useRef(null);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isShowAddPopup, setIsShowAddPopup] = useState(false);
  //Search infor
  const [searchUserText, setSearchUserText] = useState("");
  const [searchChannelText, setSearchChannelText] = useState("");
  const [isShowAddMemberPopUp, setIsShowAddMemberPopUp] = useState(false);
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
    type: "",
  });
  const [currentChannelId, setCurrentChannelId] = useState("");
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
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState("");
  const [receivedCall, setReceivedCall] = useState(false);
  const [renderMessages, setRenderMessages] = useState([]);
  const [receivedCallUser, setReceivedCallUser] = useState({
    callId: null,
    name: null,
    sendTo: null,
    type: null,
  });

  const [popup, setPopup] = useState({
    isHidden: true,
    message: "",
  });

  const [sendFile, setSendFile] = useState(false);

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
          `${SERVER_URL}/api/v1/channels/search?q=${e.target.value}`,
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
    }
  };

  // handler get old message from current channel
  const handleGetOlderMessage = async () => {
    if (preCursor)
      try {
        const res = await axios.get(
          `${SERVER_URL}/api/v1/messages/${currentChannel.id}?size=${size}&pre=${preCursor}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRenderMessages((pre) => [...pre, ...res.data.data]);
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
        `${SERVER_URL}/api/v1/messages/${cur.id}?size=${size}&pre=${cur.preCursor}`,
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
      const res = await axios.get(`${SERVER_URL}/api/v1/users/search?q=${e}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        `${SERVER_URL}/api/v1/channels/create`,
        transformData(listUsers)
      );
      setUsers([]);
      setListUsers([]);
      setChannelName("");
    } catch (err) {
      console.log(
        "🚀 ~ file: HomePage.jsx:200 ~ handleCreateChannel ~ err:",
        err
      );
    }
  };

  const handleLeaveGroup = async (body) => {
    handleSendNotificationRemoveMember(body);
    unsubscribe("/topic/group/" + body.idChannel + "/chat");
    try {
      const res = await axios.delete(
        `${SERVER_URL}/api/v1/channels/removeUser`,
        {
          data: body,
        }
      );
      handleResetData();
      fetchData();
    } catch (err) {
      console.log("🚀 ~ file: HomePage.jsx:213 ~ handleLeaveGroup ~ err:", err);
    }
  };

  const handleAddMember = async (body) => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/api/v1/channels/addUser`,
        body
      );
      handleSendNotificationAddMember(body);
      fetchData();
    } catch (err) {
      console.log("🚀 ~ file: HomePage.jsx:213 ~ handleLeaveGroup ~ err:", err);
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

  const handleSendFile = (fileInfo) => {
    const newSendMessage = {
      type: fileInfo.isImage ? "IMAGE" : fileInfo.isVideo ? "VIDEO" : "FILE",
      sender: {
        userId: userLoggedIn?.id,
        username: userLoggedIn?.username,
      },
      sendTo: currentChannel.userId ? currentChannel.userId : null,
      channelId: currentChannel.id,
      content: fileInfo.fileName,
      fileUrl: fileInfo.fileDownloadUri,
    };
    if (currentChannel?.type == "group") {
      send(`/app/chat/group/${currentChannel.id}`, newSendMessage, {});
    } else {
      send("/app/chat/pm", newSendMessage, {});
    }
    scrollToBottom();
  };

  const handleSendNotificationAddMember = (user) => {
    const newSendMessage = {
      position: "right",
      type: "JOIN",
      content: user.username + " joined group",
      sender: {
        userId: userLoggedIn?.id,
        username: userLoggedIn?.username,
      },
      sendTo: user.idUser ? user.idUser : null,
      channelId: currentChannelId,
    };
    send(`/app/chat/group/${currentChannelId}`, newSendMessage, {});

    fetchData();
    scrollToBottom();
  };
  const handleSendNotificationRemoveMember = (user) => {
    const newSendMessage = {
      position: "right",
      type: "LEAVE",
      content: userLoggedIn.username + " leaved group",
      sender: {
        userId: userLoggedIn?.id,
        username: userLoggedIn?.username,
      },
      sendTo: currentChannelId ? currentChannelId : null,
      channelId: currentChannelId,
    };
    scrollToBottom();
    send(`/app/chat/group/${currentChannelId}`, newSendMessage, {});
  };

  const handleChatItemClick = (
    isOnline,
    name,
    messageTime,
    idChannel,
    userId,
    type
  ) => {
    setCurrentChannel({
      id: idChannel,
      name: name,
      isOnline: isOnline,
      messageTime: messageTime,
      userId,
      type,
    });
    currentChannelIdRef.current = idChannel;
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
  const subscribeChat = (message) => {
    if (message.type == "CREATE") {
      const path = "/topic/group/" + message.channelId + "/chat";
      subscribe(path, subscribeChat);
    }
    if (currentChannelIdRef.current == message.channelId)
      setRenderMessages((pre) => [message, ...pre]);
    setNewMessage((pre) => message);
  };

  const subscribeUserChatPM = () => {
    const path = `/user/${userLoggedIn.id}/pm`;
    subscribe(path, subscribeChat);
  };

  const subscribeNewGroup = () => {
    const path = `/user/${userLoggedIn.id}/join-group`;
    const callback = (message) => {
      if (message.type == "JOIN") {
        const path = "/topic/group/" + message.channelId + "/chat";
        subscribe(path, subscribeChat);
        fetchData();
      }
    };
    subscribe(path, callback);
  };

  const getGroupsOfUser = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/v1/channels?type=group`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      console.log("🚀 ~ getGroupOfUser ~ err:", err);
    }
  };

  const subscribeGroupChat = async () => {
    const groups = await getGroupsOfUser();
    if (groups == null) return;
    groups.forEach((group) => {
      const path = "/topic/group/" + group + "/chat";
      subscribe(path, subscribeChat);
      subscribeGroupVideoCall(group);
    });
  };

  const subscribeUserVideoCall = () => {
    const path = `/user/${userLoggedIn.id}/call`;
    const callback = function (message) {
      if (message.type == "CREATE") {
        setReceivedCallUser({
          name: message.sender.username,
          callId: message.payload.callId,
          sendTo: message.sender.userId,
          type: "pm",
        });
        setReceivedCall(true);
      } else if (message.type == "CANCEL" || message.type == "STOP") {
        setReceivedCall(false);
      }
    };
    subscribe(path, callback);
  };

  const subscribeGroupVideoCall = (groupId) => {
    const path = `/topic/group/${groupId}/new-call`;
    const callback = function (message) {
      console.log(userLoggedIn, message);
      if (
        message.type == "CREATE" &&
        userLoggedIn.id != message.sender.userId
      ) {
        setReceivedCallUser({
          name: message.sender.username,
          sendTo: message.payload.channelId,
          callId: message.payload.callId,
          type: "group",
        });
        setReceivedCall(true);
      }
    };
    subscribe(path, callback);
  };

  useEffect(() => {
    if (userLoggedIn == null) return;
    client.onConnect = () => {
      subscribeUserChatPM();
      subscribeGroupChat();
      subscribeUserVideoCall();
      sendStatusToServer();
      subscribeNewGroup();
    };
  }, [client]);

  useEffect(() => {
    if (newMessage == null) return;
    reArrangeUsersOnMessageSend(newMessage.channelId, newMessage);
  }, [newMessage]);

  const handleOnlineStatus = () => {
    isOnline = true;
  };

  useEffect(() => {
    if (userLoggedIn == null) window.location.reload();
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

  const handleCloseCallPopup = () => {
    setReceivedCall(false);
  };

  const resetUstate = () => {
    setRenderMessages([]);
    setCurrentChannel({
      id: "",
      isOnline: false,
      name: "",
      messageTime: "",
      userId: null,
    });
    setPreCursor("");
    setNextCursor("");
    setAllChannels([]);
    setUsers([]);
    setListUsers([]);
    setChannelName("");
    setIsEmptyChannelName(false);
    setReceivedCall(false);
    setReceivedCallUser({
      callId: null,
      name: null,
      sendTo: null,
    });
    setData([]);
  };

  const handleClosePopup = () => {
    setPopup({
      isHidden: true,
      message: "",
    });
  };
  if (token == null) return <div></div>;
  return (
    <>
      {sendFile && currentChannel.id != "" && (
        <SendFilePopUp
          setSendFile={setSendFile}
          handleSendFile={handleSendFile}
        />
      )}

      {!popup.isHidden && !receivedCall && (
        <Popup handleClose={handleClosePopup} message={popup.message}></Popup>
      )}
      {receivedCall && (
        <ReceivedCallPopup
          name={receivedCallUser.name}
          callId={receivedCallUser.callId}
          sendTo={receivedCallUser.sendTo}
          type={receivedCallUser.type}
          handleClose={handleCloseCallPopup}
        />
      )}
      <div className={`${isDarkTheme && "dark"}`}>
        <div
          className={`w-full h-screen bg-[#ECF0F3]  flex items-center duration-300 transition-all dark:bg-[#1A1D24]`}
        >
          <div
            className={`max-w-[80%] w-full h-[90%] bg-[#ECF0F3] dark:bg-[#1A1D24]  ${
              isDarkTheme ? "float-neumorphism-dark" : "float-neumorphism"
            } m-auto rounded-2xl flex px-4 py-2 gap-4`}
          >
            {/* Sidebar */}
            <div
              className={`relative flex flex-col w-[80px] h-full items-center justify-between ${
                isDarkTheme ? "float-neumorphism-dark" : "float-neumorphism"
              }  rounded-lg p-3`}
            >
              <div className="relative group cursor-pointer ">
                <Avatar
                  name={userLoggedIn?.username}
                  size={12}
                  className="group-hover:name-block"
                />
                <p
                  className={`name hidden px-4 py-2 absolute top-0 rounded-md left-[-150px] group-hover:block 
                  font-bold ${
                    isDarkTheme ? "bg-white" : "text-black bg-gray-200 "
                  }
              `}
                >
                  {userLoggedIn?.username}
                </p>
              </div>
              <div className="px-1 py-1 cursor-pointer relative">
                <BiMenu
                  size={32}
                  className={`${isDarkTheme && "text-white"} hover:opacity-60 `}
                  onClick={() => setIsShowMenu(!isShowMenu)}
                />
                {isShowMenu && (
                  <div
                    className={`absolute w-[150px] h-[50px] bg-white dark:bg-[#2D323D] dark:text-white rounded-full top-[-180%] left-[-50%] z-50 flex items-center justify-center  shadow-xl`}
                  >
                    <div
                      className="w-[70%] h-[70%] rounded-full hover:bg-[#ECF0F3] dark:hover:bg-[#1A1D24] flex items-center justify-center gap-2"
                      onClick={() => {
                        logout();
                        resetUstate();
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
            <div className="w-[40%] z-10 h-full rounded-lg py-3 px-2 flex flex-col items-center gap-4">
              <div
                className={`w-[50%] h-12  ${
                  isDarkTheme ? "float-neumorphism-dark" : "float-neumorphism"
                } flex items-center justify-center gap-2 px-2 py-1 rounded-full`}
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
                className={`w-full h-10 ${
                  isDarkTheme && "deep-neumorphism-dark"
                } deep-neumorphism bg-[#ECF0F3] dark:bg-[#1A1D24] rounded-full flex items-center justify-between`}
              >
                <div className="flex items-center px-2 py-2 gap-2">
                  <AiOutlineSearch
                    size={28}
                    className={`text-[#1A1D24] dark:text-white`}
                    onClick={() => {
                      handleGetAllChannelCreated(e);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search Messenger"
                    className={`text-gray-700 placeholder-[#495FB8] dark:text-white bg-transparent text-md outline-none`}
                    onChange={(e) => handleGetAllChannelCreated(e)}
                  ></input>
                </div>
              </div>
              <div
                className={`flex flex-col z-10 gap-3 h-full overflow-x-hidden overflow-y-auto no-scrollbar w-full ${
                  isDarkTheme && "deep-neumorphism-dark"
                } deep-neumorphism rounded-xl px-2 py-3`}
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
                            item?.userId,
                            item?.type
                          );
                        }}
                        setCurrentChannelId={setCurrentChannelId}
                        leaveGroup={handleLeaveGroup}
                        addMember={handleAddMember}
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
              className={`h-full w-full flex flex-col justify-between  py-2 px-2 bg-[#ECF0F3] dark:bg-[#1A1D24]`}
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
                <div className="w-[60px] flex items-center justify-center">
                  <button
                    className={` w-[60px] h-[60px] rounded-full cursor-pointer feature-btn ${
                      isDarkTheme
                        ? "float-neumorphism-chat-dark feature-btn-dark"
                        : "float-neumorphism-chat feature-btn"
                    } flex items-center justify-center text-[#495FB8]`}
                  >
                    <div className="w-[60px] mx-4  flex items-center justify-center">
                      <VideoCallButton
                        isDarkTheme={isDarkTheme}
                        channelId={currentChannel.id}
                        sendTo={currentChannel.userId}
                        setPopup={setPopup}
                        channelName={currentChannel.name}
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
                  className=" flex flex-col gap-4 overflow-auto overflow-x-hidden h-full py-4  "
                  id="chatContent"
                  ref={chatContentRef}
                  style={{ flexDirection: "column-reverse" }}
                >
                  {currentChannel.name != "" ? (
                    renderMessages?.map((message) =>
                      message.type == "CREATE" ||
                      message.type == "JOIN" ||
                      message.type == "LEAVE" ? (
                        <MessageCenter
                          key={message?.id}
                          messageType={message?.type}
                          content={message?.content}
                          isDarkTheme={isDarkTheme}
                        />
                      ) : message.sender.userId != userLoggedIn.id ? (
                        <MessageReceived
                          key={message?.id}
                          isDarkTheme={isDarkTheme}
                          content={message?.content}
                          username={message?.sender.username}
                          createdAt={message?.createdAt}
                          type={message?.type}
                          fileUrl={message?.fileUrl}
                          isGroup={currentChannel?.type == "group"}
                        />
                      ) : (
                        <MessageSend
                          key={message?.id}
                          createdAt={message?.createdAt}
                          content={message?.content}
                          type={message?.type}
                          fileUrl={message?.fileUrl}
                        />
                      )
                    )
                  ) : (
                    <div className="flex flex-col justify-center h-full items-center gap-4">
                      <img
                        className="w-[400px] h-[400px]"
                        src="../../public/logo_truong.png"
                        alt="Nothing"
                      />
                      <h1
                        className={`text-6xl font-bold mt-2 ${
                          isDarkTheme && "text-white"
                        }`}
                      >
                        DUT Chat
                      </h1>
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
                  {/* <button
                    className={` w-[40px] h-[40px] rounded-full cursor-pointer feature-btn ${
                      isDarkTheme
                        ? "float-neumorphism-chat-dark feature-btn-dark"
                        : "float-neumorphism-chat feature-btn"
                    } flex items-center justify-center text-[#495FB8]`}
                  >
                    <AiOutlinePlus
                      size={20}
                      onClick={() => {
                        currentChannel?.id && setSendFile(true);
                      }}
                    />
                  </button> */}
                  <button
                    className={` w-[40px] h-[40px] rounded-full cursor-pointer feature-btn ${
                      isDarkTheme
                        ? "float-neumorphism-chat-dark feature-btn-dark"
                        : "float-neumorphism-chat feature-btn"
                    } flex items-center justify-center text-[#495FB8]`}
                    onClick={() => {
                      currentChannel?.id && setSendFile(true);
                    }}
                  >
                    <AiOutlinePlus size={20} />
                  </button>
                </div>
                <input
                  className={`${
                    isDarkTheme
                      ? "deep-neumorphism-item-dark"
                      : "deep-neumorphism-item"
                  } w-full h-full rounded-lg deep-neumorphism-item outline-none px-4 text-md text-gray-700 placeholder-[#495FB8] dark:text-white bg-transparent`}
                  placeholder="Type Message"
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  ref={inputRef}
                ></input>
                <div className="w-[60px] flex items-center justify-center">
                  <button
                    className={` w-[52px] h-[52px] rounded-full cursor-pointer active:deep-neumorphism-item  ${
                      isDarkTheme
                        ? "float-neumorphism-chat-dark feature-btn-dark"
                        : "float-neumorphism-chat feature-btn"
                    } flex items-center justify-center text-[#495FB8]`}
                    onClick={handleSendMessage}
                  >
                    <RiSendPlaneFill size={30} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isShowAddPopup && (
          <SearchUserPopUp
            isShowAddPopup={isShowAddPopup}
            setIsShowAddPopup={setIsShowAddPopup}
            setListUsers={setListUsers}
            setUsers={setUsers}
            setIsEmptyChannelName={setIsEmptyChannelName}
            setSearchUserText={setSearchUserText}
            handleSearchUser={handleSearchUser}
            searchUserText={searchUserText}
            users={users}
            listUsers={listUsers}
            setChannelName={setChannelName}
            isEmptyChannelName={isEmptyChannelName}
            handleCreateChannel={handleCreateChannel}
            channelName={channelName}
            header={"New Conversation"}
            action={"Create"}
          />
        )}
        <div id="portal-root"></div>
      </div>
    </>
  );
};

export default HomePage;
