import { AiOutlineClose } from "react-icons/ai";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../config";
const SendFilePopUp = ({ setSendFile, handleSendFile }) => {
  const token = localStorage.getItem("token");
  const [fileInfo, setFileInfo] = useState({
    file: null,
    fileName: "",
    fileSize: null,
    isImage: false,
    previewImage: null,
  });

  const closePopup = () => {
    setSendFile(false);
  };

  const onChangeFileInput = (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(2);
    const isImage = file.type.startsWith("image/");
    const previewImage = isImage ? URL.createObjectURL(file) : "";

    setFileInfo({ file, fileName, fileSize, isImage, previewImage });
  };

  const handleClickButtonSend = async () => {
    const formData = new FormData();
    formData.append("file", fileInfo.file);
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/v1/upload-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      const newFile = {
        fileName: response.data.fileName,
        fileDownloadUri: response.data.fileDownloadUri,
        isImage: fileInfo.isImage,
      };
      handleSendFile(newFile);
      closePopup();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`absolute top-0 z-40 left-0 bg-black/30 w-full h-full`}>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  rounded shadow-xl flex justify-evenly items-center px-4">
        <div className="relative w-[400px] h-[270px] flex flex-col gap-4 pt-4 bg-gray-200 items-center justify-center rounded-lg">
          <div className="text-black text-sm absolute top-2 right-2 w-6 h-6 rounded-full hover:opacity-60 cursor-pointer bg-slate-300 items-center justify-center flex">
            <AiOutlineClose className="m-auto" size={12} onClick={closePopup} />
          </div>
          <div>
            <input
              type="file"
              name="file"
              onChange={(e) => onChangeFileInput(e)}
            />

            {fileInfo.fileName && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 border border-gray-300 shadow-lg">
                <input
                  type="file"
                  id="fileInput"
                  className="mb-4"
                  onChange={onChangeFileInput}
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
                      handleClickButtonSend();
                    }}
                  >
                    Send
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-lg font-semibold">
                    File Name: {fileInfo.fileName}
                  </p>
                  <p className="text-lg">File Size: {fileInfo.fileSize} KB</p>
                </div>
                {fileInfo.isImage && (
                  <img
                    id="previewImage"
                    className="mt-4 max-w-full"
                    src={fileInfo.previewImage}
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
