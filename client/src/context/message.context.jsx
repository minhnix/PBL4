import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";

const MessageContext = createContext();

const MessageProvider = (props) => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const userLoggedIn = token ? jwtDecode(token).user : null;
  const [newMessage, setNewMessage] = useState(null);

  const fetchData = async () => {
    try {
      if (!token) {
        setData([]);
        return;
      }

      const res = await axios.get(`http://localhost:8080/api/v1/channels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (err) {
      console.log(
        "🚀 ~ file: HomePage.jsx:95 ~ handleGetAllChannels ~ err:",
        err
      );
    }
  };

  const reArrangeUsersOnMessageSend = (targetChannelId, newMessage) => {
    const targetUserIndex = data.findIndex(
      (user) => user.channelId == targetChannelId
    );
    if (targetUserIndex != -1) {
      var targetUser = data.splice(targetUserIndex, 1)[0];
      targetUser = {
        ...targetUser,
        sender: newMessage?.sender,
        latestMessage: newMessage.content,
        createdAt: newMessage.createdAt,
        messageType: newMessage.messageType || newMessage.type,
      };
      data.unshift(targetUser);
      setData([...data]);
    } else {
      fetchData();
    }
  };

  const value = {
    data,
    token,
    setData,
    fetchData,
    newMessage,
    userLoggedIn,
    setNewMessage,
    reArrangeUsersOnMessageSend,
  };

  return (
    <MessageContext.Provider value={value} {...props}></MessageContext.Provider>
  );
};

const useMessage = () => {
  const context = useContext(MessageContext);
  if (typeof context === "undefined")
    throw new Error("Something went wrong with the MessageContext");
  return context;
};

export { MessageProvider, useMessage };
