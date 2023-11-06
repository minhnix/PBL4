import { useContext, useEffect, useRef, useState } from "react";
import HangupIcon from "../assets/icons/hangup";
import { useLocation } from "react-router-dom";
import { useStomp } from "usestomp-hook/lib";
import { useMessage } from "../context/message.context";
import { StompContext } from "usestomp-hook/lib/Provider";
import axios from "axios";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);
const Videos = () => {
  const token = localStorage.getItem("token");
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const [webcamActive, setWebcamActive] = useState(false);
  const callId = searchParams.get("call_id");
  console.log("🚀 ~ Videos ~ callId:", callId);
  const mode = searchParams.get("mode");
  const sendTo = searchParams.get("send");
  const channelId = searchParams.get("channel_id");
  const localRef = useRef();
  const remoteRef = useRef();
  const { send } = useStomp();
  const client = useContext(StompContext).stompClient;
  const { userLoggedIn } = useMessage();

  const baseUrl = "http://localhost:8080/api/v1/calls/";

  const updateCall = async (requestBody) => {
    const res = await axios.patch(baseUrl + callId, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  };

  const getCall = async () => {
    const res = await axios.get(baseUrl + callId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  };

  const createVideoCall = async () => {
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const offerCandidate = event.candidate;
        console.log("🚀 ~ createVideoCall ~ offerCandidate:", offerCandidate);
        updateCall({ offerCandidate }).then(() => {
          console.log("OK");
        });
      }
    };
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);
    await updateCall({ offerDescription });
    const message = {
      type: "CREATE",
      sender: {
        userId: userLoggedIn.id,
        username: userLoggedIn.username,
      },
      sendTo,
      payload: {
        callId,
        channelId,
      },
    };
    send("/app/call/pm", message, {});
  };

  const joinVideoCall = async () => {
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const answerCandidate = event.candidate;
        console.log("🚀 ~ joinVideoCall ~ answerCandidate:", answerCandidate);
        updateCall({ answerCandidate }).then(() => {
          console.log("OK");
        });
      }
    };
    const fetchDataInterval = setInterval(async () => {
      const callData = await getCall();
      if (callData.data?.offerDescription) {
        clearInterval(fetchDataInterval);

        await handleJoinVideoCall(callData);
      }
    }, 100);
  };

  async function handleJoinVideoCall(callData) {
    await pc.setRemoteDescription(
      new RTCSessionDescription(callData.data.offerDescription)
    );
    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);
    await updateCall({ answerDescription });
    callData.data?.offerCandidates &&
      callData.data.offerCandidates.forEach((data) => {
        pc.addIceCandidate(new RTCIceCandidate(data));
      });
    const message = {
      type: "JOIN",
      sender: {
        userId: userLoggedIn.id,
        username: userLoggedIn.username,
      },
      sendTo,
      payload: {
        callId,
      },
    };
    console.log("🚀 ~ joinVideoCall ~ message:", message);
    send("/app/call/pm", message, {});
  }

  const setupSources = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
    localRef.current.srcObject = localStream;
    remoteRef.current.srcObject = remoteStream;
    setWebcamActive(true);

    if (mode === "create") {
      await createVideoCall();
    } else if (mode === "join") {
      await joinVideoCall();
    }

    pc.onconnectionstatechange = (event) => {
      if (pc.connectionState === "disconnected") {
        hangUp();
      }
    };
  };

  const hangUp = async () => {
    await axios.delete(baseUrl + callId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    pc.close();
    window.close();
  };

  const subscribeUserVideoCall = (client) => {
    const path = `/user/${userLoggedIn.id}/call`;
    client.subscribe(path, ({ body }) => {
      const message = JSON.parse(body);
      if (message.type === "JOIN") {
        console.log("🚀 ~ client.subscribe ~ message:", message);
        getCall().then((callData) => {
          console.log(callData);
          if (!pc.currentRemoteDescription) {
            pc.setRemoteDescription(
              new RTCSessionDescription(callData.data.answerDescription)
            );
          }
          callData.data?.answerCandidates &&
            callData.data.answerCandidates.forEach((data) => {
              pc.addIceCandidate(new RTCIceCandidate(data));
            });
        });
      }
    });
  };
  useEffect(() => {
    if (userLoggedIn == null) return;
    client.onConnect = () => {
      subscribeUserVideoCall(client);
    };
  }, [client]);

  useEffect(() => {
    setupSources();
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      hangUp();
      return (e.returnValue = "Are you sure you want to close?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="videos">
      <video ref={localRef} autoPlay playsInline className={`local`} muted />
      <video
        ref={remoteRef}
        autoPlay
        playsInline
        className={`w-full h-full remote`}
      />
      <div className="buttonsContainer">
        <button
          onClick={hangUp}
          disabled={!webcamActive}
          className="hangup button"
        >
          <HangupIcon />
        </button>
      </div>
      {/* {!webcamActive && (
        <div className="modalContainer">
          <div className="modal">
            <h3>Turn on your camera and microphone and start the call</h3>
            <div className="container">
              <button
                onClick={() => {
                  window.close();
                }}
                className="secondary"
              >
                Cancel
              </button>
              <button onClick={setupSources}>Start</button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Videos;
