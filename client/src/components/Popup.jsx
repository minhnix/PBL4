import { AiOutlineClose } from "react-icons/ai";

const Popup = ({ handleClose, message }) => {
  return (
    <div className={`absolute top-0 z-40 left-0 bg-black/30 w-full h-full`}>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  rounded shadow-xl flex justify-evenly items-center px-4">
        <div className="relative w-[300px] h-[170px] flex flex-col gap-4 pt-4 bg-gray-200 items-center justify-center rounded-lg">
          <div className="text-black text-sm absolute top-2 right-2 w-6 h-6 rounded-full hover:opacity-60 cursor-pointer bg-slate-300 items-center justify-center flex">
            <AiOutlineClose
              className="m-auto"
              size={12}
              onClick={handleClose}
            />
          </div>
          <p className="text-lg font-bold">{message}</p>
          <div className="flex mt-2 gap-6">
            <div className="flex flex-col gap-2 items-center">
              <button className="w-10 h-10 rounded-full border-2 bg-red-500 flex items-center justify-center hover:opacity-70">
                <AiOutlineClose
                  size={18}
                  className="text-white "
                  onClick={handleClose}
                />
              </button>
              <p className="text-sm font-bold text-red-600">Close</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
