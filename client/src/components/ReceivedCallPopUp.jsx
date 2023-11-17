import { IoCall } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import Avatar from "./Avatar";
import { useMessage } from "../context/message.context";
import { useStomp } from "usestomp-hook/lib";

const ReceivedCallPopUp = ({ name, callId, handleClose, sendTo }) => {
  const { userLoggedIn } = useMessage();
  const { send } = useStomp();
  const cancelCall = () => {
    const message = {
      type: "CANCEL",
      sender: {
        userId: userLoggedIn.id,
        username: userLoggedIn.username,
      },
      sendTo,
      payload: {
        callId,
      },
    };
    send("/app/call/pm", message, {});
    handleClose();
  };
  return (
    <div className={`absolute top-0 z-40 left-0 bg-black/30 w-full h-full`}>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  rounded shadow-xl flex justify-evenly items-center px-4">
        <div className="relative w-[400px] h-[270px] flex flex-col gap-4 pt-4 bg-gray-200 items-center justify-center rounded-lg">
          <div className="text-black text-sm absolute top-2 right-2 w-6 h-6 rounded-full hover:opacity-60 cursor-pointer bg-slate-300 items-center justify-center flex">
            <AiOutlineClose className="m-auto" size={12} onClick={cancelCall} />
          </div>
          <Avatar name={name} className=" mx-auto" />
          <p className="text-lg font-bold">{name} is calling you.</p>
          <p className="mt-[-12px]">
            The call will start as soon as you accept.
          </p>
          <div className="flex my-2 gap-6">
            <div className="flex flex-col gap-2 items-center">
              <button className="w-12 h-12 rounded-full border-2 bg-red-500 flex items-center justify-center hover:opacity-70">
                <AiOutlineClose
                  size={18}
                  className="text-white "
                  onClick={cancelCall}
                />
              </button>
              <p className="text-sm font-bold text-red-600">Decline</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <button className="w-12 h-12 rounded-full border-2 bg-green-500 flex items-center justify-center hover:opacity-70">
                <IoCall
                  size={18}
                  className=" text-white"
                  onClick={() => {
                    handleClose();
                    window.open(
                      `http://localhost:5173/video/?mode=join&call_id=${callId}&send=${sendTo}`,
                      "_blank",
                      "rel=noopener noreferrer"
                    );
                  }}
                />
              </button>
              <p className="text-sm font-bold text-green-500 ">Accept</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivedCallPopUp;
