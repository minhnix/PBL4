import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";

const MessageContext = createContext();

const MessageProvider = (props) => {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const userLoggedIn = jwtDecode(token).user;
  const [user, setUser] = useState();

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/channels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
      console.log(
        "🚀 ~ file: message.context.jsx:23 ~ fetchData ~ res:",
        res.data
      );
    } catch (err) {
      console.log(
        "🚀 ~ file: HomePage.jsx:95 ~ handleGetAllChannels ~ err:",
        err
      );
    }
  };

  const reArrangeUsersOnMessageSend = (
    targetChannelId,
    newMessage,
    renderMessages
  ) => {
    const targetUserIndex = data.findIndex(
      (user) => user.channelId == targetChannelId
    );
    if (targetUserIndex != -1) {
      var targetUser = data.splice(targetUserIndex, 1)[0];
      targetUser = {
        ...targetUser,
        latestMessage: newMessage.content,
        createdAt: newMessage.date,
      };
      data.unshift(targetUser);
      setData([...data]);
      console.log(
        "🚀 ~ file: message.context.jsx:51 ~ MessageProvider ~ data:",
        [...data]
      );
    }
  };

  const value = {
    token,
    userLoggedIn,
    fetchData,
    data,
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
