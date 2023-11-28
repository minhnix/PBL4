import { AiOutlineClose } from "react-icons/ai";
import React, { useEffect, useState } from "react";
const SendFilePopUp = ({
  userLoggedIn,
  currentChannel,
  setSendFile,
  fileInfo,
  setFileInfo,
  handleSendFile,
}) => {
  const closePopup = () => {
    setSendFile(false);
    setFileInfo((pre) => {
      return {
        ...pre,
        fileName: "",
        fileSize: "",
        isImage: false,
        previewUrl: "",
      };
    });
  };

  const displayFileInfo = (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(2);
    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : "";

    // Read file data as a byte array
    const reader = new FileReader();
    reader.onload = (event) => {
      
      const data = new Uint8Array(event.target.result);

      setFileInfo((pre) => {
        return {
          ...pre,
          fileName,
          fileSize,
          isImage,
          previewUrl,
          data: Array.from(data),
        };
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className={`absolute top-0 z-40 left-0 bg-black/30 w-full h-full`}>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  rounded shadow-xl flex justify-evenly items-center px-4">
        <div className="relative w-[400px] h-[270px] flex flex-col gap-4 pt-4 bg-gray-200 items-center justify-center rounded-lg">
          <div className="text-black text-sm absolute top-2 right-2 w-6 h-6 rounded-full hover:opacity-60 cursor-pointer bg-slate-300 items-center justify-center flex">
            <AiOutlineClose
              className="m-auto"
              size={12}
              onClick={() => {
                setSendFile(false);
              }}
            />
          </div>
          <div>
            <input
              type="file"
              name="file"
              onChange={(e) => {
                displayFileInfo(e);
              }}
            />

            {fileInfo.fileName && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 border border-gray-300 shadow-lg">
                <input
                  type="file"
                  id="fileInput"
                  className="mb-4"
                  onChange={displayFileInfo}
                />
                <div className="flex gap-4">
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                    onClick={() => {
                      handleSendFile();
                    }}
                  >
                    Send
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-lg font-semibold">
                    File Name: {fileInfo.fileName}
                  </p>
                  <p className="text-lg">File Size: {fileInfo.fileSize}</p>
                </div>
                {fileInfo.isImage && (
                  <img
                    id="previewImage"
                    className="mt-4 max-w-full"
                    src={fileInfo.previewUrl}
                    alt="Preview"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendFilePopUp;
