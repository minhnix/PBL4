import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const SearchUserPopUp = ({
  isShowAddPopup,
  setIsShowAddPopup,
  setListUsers,
  setUsers,
  setIsEmptyChannelName,
  setSearchUserText,
  handleSearchUser,
  searchUserText,
  users,
  listUsers,
  setChannelName,
  isEmptyChannelName,
  handleCreateChannel,
  channelName,
  header,
  action,
}) => {
  return (
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
        <p className={` font-semibold`}>{header}</p>

        <AiOutlineClose
          size={16}
          className={`absolute top-[35%] right-2 cursor-pointer  bg-gray-300 rounded-full p-[2px] w-[20px] h-[20px] hover:opacity-50 `}
          onClick={(e) => {
            setIsShowAddPopup(false);
            setListUsers([]);
            setUsers([]);
            setIsEmptyChannelName(false);
          }}
        />
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
                    `#${item.username + action}`
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
                  id={item.username + action}
                  value={item}
                  onClick={() => {
                    const checkbox = document.querySelector(
                      `#${item.username + action}`
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
                />
              </div>
            ))}
        </div>
      </div>
      {/* Name group */}
      {action == "Create" && (
        <div className="flex flex-col gap-2 my-2">
          {listUsers.length > 1 && (
            <div>
              <label className="px-2">Name group</label>
              <input
                type="text"
                required
                placeholder="Enter name group chat"
                className="px-2 py-4 border border-radius-4 border-black h-6 rounded-md outline-none"
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
      )}
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
          {action}
        </button>
      </div>
    </div>
  );
};

export default SearchUserPopUp;
