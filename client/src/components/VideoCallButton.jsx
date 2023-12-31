import { BsCameraVideoFill } from "react-icons/bs";
import axios from "axios";
import { useMessage } from "../context/message.context";
import { CLIENT_URL, SERVER_URL } from "../config";

const VideoCallButton = ({
  isDarkTheme,
  channelId,
  sendTo,
  setPopup,
  channelName,
}) => {
  const { userLoggedIn } = useMessage();
  const token = localStorage.getItem("token");
  const handleClickButton = async () => {
    if (!sendTo) {
      window.open(
        `${CLIENT_URL}/room/${channelId}`,
        "_blank",
        "rel=noopener noreferrer"
      );
    } else {
      try {
        const requestBody = {
          sender: {
            userId: userLoggedIn.id,
            username: userLoggedIn.username,
          },
          sendTo,
          payload: {
            channelId,
          },
        };
        const res = await axios.post(
          `${SERVER_URL}/api/v1/calls`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.data?.id) return;
        if (res.data.status == "CREATE")
          window.open(
            `${CLIENT_URL}/video/?mode=create&call_id=${res.data.id}&send=${res.data.sendTo}&channel_id=${res.data.channelId}`,
            "_blank",
            "rel=noopener noreferrer"
          );
        else if (res.data.status == "JOIN")
          window.open(
            `${CLIENT_URL}/video/?mode=join&call_id=${res.data.id}&send=${res.data.sender.userId}&channel_id=${res.data.channelId}`,
            "_blank",
            "rel=noopener noreferrer"
          );
      } catch (err) {
        const messageError = err.response.data.message;
        if (messageError.includes("You")) {
          setPopup({
            isHidden: false,
            message: messageError,
          });
        } else if (messageError.includes("User")) {
          setPopup({
            isHidden: false,
            message: channelName + " is calling",
          });
        } else {
          console.log(err);
        }
      }
    }
  };
  return (
    <>
      <button
        className={` w-[60px] h-[60px] rounded-full cursor-pointer feature-btn ${
          isDarkTheme
            ? "float-neumorphism-chat-dark feature-btn-dark"
            : "float-neumorphism-chat feature-btn"
        } flex items-center justify-center text-[#495FB8]`}
        onClick={handleClickButton}
      >
        <BsCameraVideoFill size={28} />
      </button>
    </>
  );
};

export default VideoCallButton;
