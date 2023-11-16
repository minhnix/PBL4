import React, { useRef, useState, useEffect } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
const Main = (props) => {
  const roomRef = useRef();
  const userRef = useRef();
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("FE-error-user-exist", ({ error }) => {
      if (!error) {
        const roomName = roomRef.current.value;
        const userName = userRef.current.value;
        sessionStorage.setItem("user", userName);
        navigate(`/room/${roomName}`);
      } else {
        setErr(error);
        setErrMsg("User name already exist");
      }
    });
  }, []);

  function clickJoin() {
    const roomName = roomRef.current.value;
    const userName = userRef.current.value;

    if (!roomName || !userName) {
      setErr(true);
      setErrMsg("Enter Room Name or User Name");
    } else {
      socket.emit("BE-check-user", { roomId: roomName, userName });
    }
  }

  return (
    <>
      <main className="w-full min-h-screen flex items-center bg-gray-200 justify-center">
        <section className="flex flex-col gap-4 w-[50%] px-4 py-4 bg-white shadow-xl items-center">
          <h1 className="text-center font-bold text-2xl leading-normal">
            Group Call
          </h1>
          <section className="flex gap-4 items-start">
            <label htmlFor="room" className="min-w-[100px]">
              Room ID :{" "}
            </label>
            <input
              type="text"
              name="room"
              placeholder="Enter room ID"
              className="px-4 py-2 outline-none focus:outline-none border border-gray-500"
              ref={roomRef}
            />
          </section>
          <section className="flex gap-4 items-start">
            <label htmlFor="username" className="min-w-[100px]">
              Username :{" "}
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter room ID"
              className="px-4 py-2 outline-none focus:outline-none border border-gray-500"
              ref={userRef}
            />
          </section>
          <button
            className="min-w-[64px] bg-sky-600 text-base font-medium px-8 py-4 hover:opacity-60 rounded text-white"
            onClick={clickJoin}
          >
            Join
          </button>
          {err ? <span className="text-red-500 text-sm ">{errMsg}</span> : null}
        </section>
      </main>
    </>
  );
};

export default Main;
