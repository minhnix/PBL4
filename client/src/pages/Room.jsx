import { useState, useEffect, useRef, useContext } from "react";
import Peer from "simple-peer";
import VideoCard from "../components/CallVideo/VideoCard";
import BottomBar from "../components/CallVideo/BottomBar";
import { useParams } from "react-router-dom";
import { useStomp } from "usestomp-hook/lib";
import { StompContext } from "usestomp-hook/lib/Provider";
import { useMessage } from "../context/message.context";

const Room = () => {
  const { userLoggedIn } = useMessage();
  const client = useContext(StompContext).stompClient;
  const { send, subscribe } = useStomp();
  const [peers, setPeers] = useState([]);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });
  const [videoDevices, setVideoDevices] = useState([]);
  const [showVideoDevices, setShowVideoDevices] = useState(false);
  const peersRef = useRef([]);
  const userVideoRef = useRef();
  const userStream = useRef();
  const { roomId } = useParams();

  const callURL = `/app/call/group/${roomId}`;

  // const setUpSources = async;

  useEffect(() => {
    if (userLoggedIn == null) return;

    client.onConnect = () => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const filtered = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setVideoDevices(filtered);
      });

      // Set Back Button Event
      window.addEventListener("popstate", goToBack);

      // Connect Camera & Mic
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          userVideoRef.current.srcObject = stream;
          userStream.current = stream;
          subscribe("/topic/group/" + roomId + "/join-call", (message) => {
            const peers = [];
            if (message.sender.userId == userLoggedIn.id) {
              setPeers(peers);
              return;
            }
            // message.payload.infos.forEach((info) => {
            let { userId, userName, enableVideo, enableAudio } =
              message.payload.info;
            // if (userId != userLoggedIn.id) {
            console.log(userLoggedIn.id + " :::: " + userId);
            const peer = createPeer(userId, stream);
            peer.userName = userName;
            peer.peerID = userId;
            peersRef.current.push({
              peerID: userId,
              peer,
              userName,
            });
            // peers.push(peer);
            setPeers((pre) => [...pre, peer]);
            setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { video: enableVideo, audio: enableAudio },
              };
            });
            // }
            // });
            // setPeers(peers);
          });
          subscribe(`/user/${userLoggedIn.id}/call`, (message) => {
            if (message.type == "CALL") {
              let { userId, userName, enableVideo, enableAudio } =
                message.payload.info;
              const peerIdx = findPeer(message.sender.userId);
              console.log("🚀 ~ subscribe ~ peerIdx:", peerIdx);
              if (!peerIdx) {
                const peer = addPeer(message.payload.signal, userId, stream);
                peer.userName = userName;
                peersRef.current.push({
                  peerID: userId,
                  peer,
                  userName: userName,
                });
                setPeers((users) => {
                  return [...users, peer];
                });
                setUserVideoAudio((preList) => {
                  return {
                    ...preList,
                    [peer.userName]: { video: enableVideo, audio: enableAudio },
                  };
                });
              }
            } else if (message.type == "ACCEPT") {
              const peerIdx = findPeer(message.sender.userId);
              peerIdx.peer.signal(message.payload.signal);
            }
          });
          subscribe(`/topic/group/${roomId}/leave-call`, (message) => {
            const peerIdx = findPeer(message.sender.userId);
            peerIdx.peer.destroy();
            // document.querySelector(`.user-${message.sender.username}`).remove();
            setPeers((users) => {
              users = users.filter(
                (user) => user.peerID !== peerIdx.peer.peerID
              );
              return [...users];
            });
            peersRef.current = peersRef.current.filter(
              ({ peerID }) => peerID !== message.sender.userId
            );
          });
          const message = {
            type: "JOIN",
            payload: {},
          };
          send(callURL, message, {});
        });

      subscribe(`/topic/group/${roomId}/toggle`, (message) => {
        const peerIdx = findPeer(message.sender.userId);
        console.log("🚀 ~ subscribe ~ peerIdx:", peerIdx);
        console.log(userVideoAudio);
        if (!peerIdx) return;
        setUserVideoAudio((preList) => {
          let video = preList[peerIdx.userName].video;
          let audio = preList[peerIdx.userName].audio;

          if (message.type === "TOGGLE_CAM") video = !video;
          else audio = !audio;

          return {
            ...preList,
            [peerIdx.userName]: { video, audio },
          };
        });
      });
    };
    // Get Video Devices
  }, [client]);

  function createPeer(userId, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      console.log("🚀 ~ peer.on ~ signal:", signal);
      const callMessage = {
        type: "CALL",
        sendTo: userId,
        payload: {
          signal,
        },
      };
      send(callURL, callMessage, {});
    });
    peer.on("disconnect", () => {
      peer.destroy();
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      console.log("🚀 ~ peer.on ~ signal:", signal);
      const callMessage = {
        type: "ACCEPT",
        sendTo: callerId,
        payload: {
          signal,
        },
      };
      send(callURL, callMessage, {});
    });

    peer.on("disconnect", () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);
    return peer;
  }

  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  function createUserVideo(peer, index, arr) {
    console.log(peer);
    return (
      <div
        className={`user-${peer.userName} relative flex justify-center items-center`}
        key={index}
      >
        {writeUserName(peer.userName)}
        <VideoCard key={index} peer={peer} number={arr.length} />
      </div>
    );
  }

  function writeUserName(userName) {
    console.log(userVideoAudio);
    if (userVideoAudio.hasOwnProperty(userName)) {
      if (!userVideoAudio[userName].video) {
        return (
          <div className="absolute z-[1] text-white" key={userName}>
            {userName}
          </div>
        );
      }
    }
  }

  // BackButton
  const goToBack = (e) => {
    const message = {
      type: "LEAVE",
    };
    send(callURL, message, {});
    // window.location.href = "/";
  };

  const toggleCamera = () => {
    setUserVideoAudio((preList) => {
      let videoSwitch = preList["localUser"].video;
      let audioSwitch = preList["localUser"].audio;
      const userVideoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
      videoSwitch = !videoSwitch;
      userVideoTrack.enabled = videoSwitch;
      return {
        ...preList,
        localUser: { video: videoSwitch, audio: audioSwitch },
      };
    });
    const message = {
      type: "TOGGLE_CAM",
    };
    send(callURL, message, {});
  };

  const toggleAudio = () => {
    setUserVideoAudio((preList) => {
      let videoSwitch = preList["localUser"].video;
      let audioSwitch = preList["localUser"].audio;
      const userAudioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
      audioSwitch = !audioSwitch;
      if (userAudioTrack) {
        userAudioTrack.enabled = audioSwitch;
      } else {
        userStream.current.getAudioTracks()[0].enabled = audioSwitch;
      }
      return {
        ...preList,
        localUser: { video: videoSwitch, audio: audioSwitch },
      };
    });

    const message = {
      type: "TOGGLE_MIC",
    };
    send(callURL, message, {});
  };

  const expandScreen = (e) => {
    const elem = e.target;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  const clickBackground = () => {
    if (!showVideoDevices) return;

    setShowVideoDevices(false);
  };

  const clickCameraDevice = (event) => {
    if (
      event &&
      event.target &&
      event.target.dataset &&
      event.target.dataset.value
    ) {
      const deviceId = event.target.dataset.value;
      const enabledAudio =
        userVideoRef.current.srcObject.getAudioTracks()[0].enabled;

      navigator.mediaDevices
        .getUserMedia({ video: { deviceId }, audio: enabledAudio })
        .then((stream) => {
          const newStreamTrack = stream
            .getTracks()
            .find((track) => track.kind === "video");
          const oldStreamTrack = userStream.current
            .getTracks()
            .find((track) => track.kind === "video");

          userStream.current.removeTrack(oldStreamTrack);
          userStream.current.addTrack(newStreamTrack);

          peersRef.current.forEach(({ peer }) => {
            // replaceTrack (oldTrack, newTrack, oldStream);
            peer.replaceTrack(
              oldStreamTrack,
              newStreamTrack,
              userStream.current
            );
          });
        });
    }
  };
  return (
    <div className="flex w-full max-h-screen" onClick={clickBackground}>
      <div className="relative w-full h-screen flex flex-row">
        <div className="max-w-full h-[92%] flex justify-around flex-row items-center p-4 box-border gap-3 w-full">
          <div
            className={`width-peer${
              peers.length > 8 ? "" : peers.length
            } absolute bottom-4 right-4 flex justify-center items-center w-[20%] h-[20%]`}
          >
            {userVideoAudio["localUser"].video ? null : (
              <div className="absolute z-[1] text-white">
                {userLoggedIn.username}
              </div>
            )}

            <video ref={userVideoRef} muted autoPlay />
          </div>
          {peers &&
            peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
        </div>
        <BottomBar
          clickCameraDevice={clickCameraDevice}
          goToBack={goToBack}
          toggleCamera={toggleCamera}
          toggleAudio={toggleAudio}
          userVideoAudio={userVideoAudio["localUser"]}
          videoDevices={videoDevices}
          showVideoDevices={showVideoDevices}
          setShowVideoDevices={setShowVideoDevices}
        />
      </div>
    </div>
  );
};

export default Room;
