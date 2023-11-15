import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const AddUserPopUp = ({
  item, // item
  listUserToShow, // list user to select
  addMember, // handle add member
  isShowSearchBox, // hidden , ""
  setIsShowSearchBox, // set is show menu item
  listUsersAdd, // list users to add
  setListUsersAdd, // set list users to add
  handleSearchUser, // handle search user API
  searchUserText, // search user text
  setSearchUserText, // set search user text
  channelInfor,
  resetData,
}) => {
  return (
    <div
      className={`absolute flex ${
        isShowSearchBox
          ? "opacity-100 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          : "opacity-0 top-[-100%] translate-x-[-50%] translate-y-[-50%] left-[50%]"
      } transition-all duration-300 linear w-[400px] h-[450px] rounded-xl bg-white dark:bg-[#2D323D] flex flex-col shadow-2xl`}
    >
      <div
        className={`w-full flex items-center justify-center py-4 relative dark:text-white`}
      >
        <p className={` font-semibold`}>Add member to conversation</p>
        <div>
          <AiOutlineClose
            size={16}
            className={`absolute top-[35%] right-2 cursor-pointer `}
            onClick={(e) => {
              resetData();
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
          value={searchUserText ? searchUserText : ""}
          onChange={(e) => {
            setSearchUserText(e.target.value);
            handleSearchUser(e.target.value, channelInfor);
          }}
        />
      </div>
      {/* list user after search */}
      <div className="w-full h-[400px] px-2 pt-2">
        <div className="flex flex-col gap-4  mt-4 text-sm dark:text-white h-[200px] overflow-auto">
          {searchUserText !== "" &&
            listUserToShow?.map((item, index) => (
              <div
                key={index}
                className="bg-red py-2 px-4 w-[80%] mx-auto flex justify-between gap-4 items-center border border-black rounded-md cursor-pointer"
                onClick={() => {
                  const checkbox = document.querySelector(`#${item.username}`);
                  if (checkbox && checkbox.checked == true) {
                    checkbox.checked = false;
                    setListUsersAdd(
                      listUsersAdd.filter((user) => user.id != item.id)
                    );
                  } else {
                    checkbox.checked = true;
                    setListUsersAdd([...listUsersAdd, item]);
                  }
                }}
              >
                {item?.username}
                <input
                  type="checkbox"
                  name="listUser"
                  id={item.username}
                  value={item}
                  onClick={() => {
                    const checkbox = document.querySelector(
                      `#${item.username}`
                    );
                    if (checkbox && checkbox.checked == true) {
                      checkbox.checked = false;
                      setListUsersAdd(
                        listUsersAdd.filter((user) => user.id != item.id)
                      );
                    } else {
                      checkbox.checked = true;
                      setListUsersAdd([...listUsersAdd, item]);
                    }
                  }}
                />
              </div>
            ))}
        </div>
      </div>

      <div className="w-full h-20 px-2 py-2 border-t-slate-200 ">
        <button
          className={`w-full h-12 bg-[#8090CB] hover:opacity-60 text-white font-semibold rounded-lg flex items-center justify-center`}
          onClick={() => {
            for (let i = 0; i < listUsersAdd.length; i++) {
              addMember({
                idChannel: item?.channelId,
                idUser: listUsersAdd[i]?.id,
                username: listUsersAdd[i]?.username,
              });
            }
            resetData();
          }}
        >
          Add Member
        </button>
      </div>
    </div>
  );
};

export default AddUserPopUp;
