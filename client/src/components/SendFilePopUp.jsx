import { AiOutlineClose, AiFillFileText, AiOutlineSend } from "react-icons/ai";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { SERVER_URL } from "../config";
const SendFilePopUp = ({ setSendFile, handleSendFile }) => {
  const token = localStorage.getItem("token");
  const [fileInfo, setFileInfo] = useState([]);

  const fileInputRef = useRef(null);

  const closePopup = () => {
    setSendFile(false);
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onChangeFileInput = (e) => {
    for (const file of e.target.files) {
      const fileName = file.name;
      const fileSize = (file.size / 1024).toFixed(2);
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const previewImage = URL.createObjectURL(file);

      if (fileSize > 10000) {
        alert("File size must be less than 10MB, please choose another file!");
        return;
      } else {
        setFileInfo((pre) => [
          ...pre,
          { file, fileName, fileSize, isImage, previewImage, isVideo },
        ]);
      }
    }
  };

  const handleClickButtonSend = async () => {
    const formData = new FormData();
    fileInfo.forEach((item) => {
      formData.append("files", item.file);
    });
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/v1/upload-multiple-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      response.data?.forEach((data) => {
        const newFile = {
          fileName: data.fileName,
          fileDownloadUri: data.fileDownloadUri,
          isImage: data.fileType.startsWith("image/"),
          isVideo: data.fileType.startsWith("video/"),
        };
        handleSendFile(newFile);
      });
      closePopup();
    } catch (error) {
      //TODO: handle when send file size larger than 10MB (BE send error)
      console.log(error);
    }
  };

  return (
    <div className={`absolute top-0 z-40 left-0 bg-black/30 w-full h-full`}>
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  rounded shadow-xl flex justify-evenly items-center px-4">
        <div className="relative w-[400px] h-[270px] flex flex-col gap-4 pt-4 bg-gray-200 items-center justify-center rounded-lg">
          <AiOutlineClose
            className="text-black text-sm absolute top-2 right-2 w-6 h-6 rounded-full hover:opacity-60 cursor-pointer bg-slate-300  p-1"
            size={12}
            onClick={closePopup}
          />
          <div>
            <div className="items-center flex flex-col justify-between gap-8">
              <input
                type="file"
                name="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => onChangeFileInput(e)}
              />
              <p className="text-xl font-semibold">Select file to send</p>
              <button
                className="flex flex-col justify-center w-[200px] bg-gray-500 text-white py-2 px-4 rounded items-center gap-2 hover:opacity-80 focus:outline-none focus:ring focus:border-blue-300"
                onClick={openFileInput}
              >
                <AiFillFileText size={40} />
                <p>Upload File</p>
              </button>
            </div>
            {fileInfo.length > 0 && (
              <div className="fixed flex flex-col justify-evenly gap-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 pb-2 border border-gray-300 shadow-lg w-[600px] h-[380px]  overflow-y-hidden rounded-md">
                <AiOutlineClose
                  className="text-black text-sm absolute top-2 right-2 w-6 h-6 rounded-full hover:opacity-60 cursor-pointer bg-slate-300  p-1"
                  size={12}
                  onClick={closePopup}
                />
                <div className="flex flex-row h-[200px] gap-4 pb-2 overflow-x-auto w-full overflow-y-hidden ">
                  <button
                    className="flex flex-col justify-center  bg-gray-500 text-white py-2 px-4 rounded items-center gap-2 hover:opacity-80 focus:outline-none focus:ring focus:border-blue-300"
                    onClick={openFileInput}
                  >
                    <AiFillFileText size={40} />
                    <p>Upload File</p>
                  </button>
                  <input
                    type="file"
                    id="fileInput"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    multiple
                    onChange={onChangeFileInput}
                  />
                  {fileInfo.map((data, index) => {
                    if (data.isImage) {
                      return (
                        <div className="relative w-[300px] h-[200px] flex-shrink-0 pb-2">
                          <AiOutlineClose
                            size={20}
                            className="absolute top-2 right-2 bg-slate-200 rounded-full hover:opacity-60 cursor-pointer"
                            onClick={() => {
                              if (fileInfo.length == 1) closePopup();
                              setFileInfo(
                                fileInfo.filter((item) => item !== data)
                              );
                            }}
                          />
                          <img
                            key={index}
                            className="w-full h-full object-cover"
                            src={data.previewImage}
                            alt={`Preview ${index}`}
                          />
                        </div>
                      );
                    } else if (data.isVideo) {
                      return (
                        <div className="relative w-[300px]  h-[200px] flex-shrink-0">
                          <AiOutlineClose
                            size={20}
                            className="absolute top-2 z-100 right-2 bg-slate-200 rounded-full hover:opacity-60 cursor-pointer z-10"
                            onClick={(e) => {
                              if (fileInfo.length === 0) closePopup();
                              console.log("Close button clicked");
                              e.stopPropagation();
                              e.preventDefault();
                              setFileInfo((prevFiles) =>
                                prevFiles.filter(
                                  (item) => item.file !== data.file
                                )
                              );
                            }}
                          />
                          <video
                            key={index}
                            className="w-full h-full object-cover "
                            controls
                          >
                            <source src={data.previewImage} controls />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex  justify-center relative min-w-[250px] bg-gray-500 text-white py-2 px-4 rounded items-center gap-2 ">
                          <AiOutlineClose
                            size={20}
                            className="absolute top-2 right-2 bg-slate-200  text-black rounded-full hover:opacity-60 cursor-pointer z-10"
                            onClick={() => {
                              if (fileInfo.length == 1) closePopup();
                              setFileInfo(
                                fileInfo.filter((item) => item !== data)
                              );
                            }}
                          />
                          <AiFillFileText size={100} className="border-r-1" />
                          <p key={index}>{data.fileName}</p>
                        </div>
                      );
                    }
                  })}
                </div>

                <div className="flex gap-8 justify-center">
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded transition duration-300 hover:opacity-60 focus:outline-none focus:ring focus:border-blue-300"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                  <button
                    className="flex gap-2 bg-blue-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    onClick={() => {
                      handleClickButtonSend();
                    }}
                  >
                    <p>Send</p>
                    <AiOutlineSend size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendFilePopUp;
