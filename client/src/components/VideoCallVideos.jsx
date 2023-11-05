import { useEffect, useRef, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import HangupIcon from "../icons/hangup";
import { useLocation } from "react-router-dom";
import {
  BsFillMicFill,
  BsFillMicMuteFill,
  BsCameraVideoOff,
  BsCameraVideo,
} from "react-icons/bs";
const firebaseConfig = {
  apiKey: "AIzaSyCJ7fVBTbRtfnM1Sd01W6ib1suxk_dmvd8",
  authDomain: "fir-rtc-14328.firebaseapp.com",
  projectId: "fir-rtc-14328",
  storageBucket: "fir-rtc-14328.appspot.com",
  messagingSenderId: "42750159151",
  appId: "1:42750159151:web:1fbc2e68e127a19dcfd9da",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);
const Videos = ({ setPage }) => {
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const [webcamActive, setWebcamActive] = useState(false);
  const [roomId, setRoomId] = useState(searchParams.get("callId"));
  const callId = searchParams.get("callId");
  const mode = searchParams.get("mode");
  const localRef = useRef();
  const remoteRef = useRef();
  const [isMuteMicrophone, setIsMuteMicrophone] = useState(false);
  const [isOffWebcam, setIsOffWebcam] = useState(false);
  const [isMuteMicrophoneCaller, setIsMuteMicrophoneCaller] = useState(false);
  const [isOffWebcamCaller, setIsOffWebcamCaller] = useState(false);
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
      const callDoc = firestore.collection("calls").doc();
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");
      window.history.pushState({}, null, `/video/${callDoc.id}`);
      //TODO : send callID to server/firebase
      console.log({
        offerId: "user1id",
        answerId: "user2id",
        channelId: "channelId",
        callId: callDoc.id,
        isAccepted: false,
      });
      setRoomId(callDoc.id);

      pc.onicecandidate = (event) => {
        event.candidate && offerCandidates.add(event.candidate.toJSON());
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await callDoc.set({ offer });

      callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    } else if (mode === "join") {
      const callDoc = firestore.collection("calls").doc(callId);
      const answerCandidates = callDoc.collection("answerCandidates");
      const offerCandidates = callDoc.collection("offerCandidates");
      pc.onicecandidate = (event) => {
        event.candidate && answerCandidates.add(event.candidate.toJSON());
      };

      const callData = (await callDoc.get()).data();

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await callDoc.update({ answer });

      offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    }

    pc.onconnectionstatechange = (event) => {
      if (pc.connectionState === "disconnected") {
        hangUp();
      }
    };
  };

  const hangUp = async () => {
    pc.close();
    // localstorage
    localStorage.removeItem("callId");
    if (roomId) {
      let roomRef = firestore.collection("calls").doc(roomId);
      await roomRef
        .collection("answerCandidates")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });
      await roomRef
        .collection("offerCandidates")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });
      await roomRef.delete();
    }
    window.close();
  };

  // const handleMute = async () => {
  //   if (mode === "create") {
  //     const localStream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: !isMuteMicrophone,
  //     });
  //     const remoteStream = new MediaStream();

  //     localStream.getTracks().forEach((track) => {
  //       pc.addTrack(track, localStream);
  //     });

  //     pc.ontrack = (event) => {
  //       event.streams[0].getTracks().forEach((track) => {
  //         remoteStream.addTrack(track);
  //       });
  //     };

  //     localRef.current.srcObject = localStream;
  //     remoteRef.current.srcObject = remoteStream;

  //     setIsMuteMicrophoneCaller(!isMuteMicrophoneCaller);
  //   } else {
  //     const localStream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: !isMuteMicrophone,
  //     });
  //     const remoteStream = new MediaStream();

  //     localStream.getTracks().forEach((track) => {
  //       pc.addTrack(track, localStream);
  //     });

  //     pc.ontrack = (event) => {
  //       event.streams[0].getTracks().forEach((track) => {
  //         remoteStream.addTrack(track);
  //       });
  //     };

  //     localRef.current.srcObject = localStream;
  //     remoteRef.current.srcObject = remoteStream;
  //     setIsMuteMicrophone(!isMuteMicrophone);
  //   }
  // };

  // useEffect(() => {
  //   async function handleK() {
  //     const localStream = await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: !isMuteMicrophone,
  //     });

  //     const remoteStream = new MediaStream();

  //     localStream.getTracks().forEach((track) => {
  //       pc.addTrack(track, localStream);
  //     });

  //     pc.ontrack = (event) => {
  //       event.streams[0].getTracks().forEach((track) => {
  //         remoteStream.addTrack(track);
  //       });
  //     };

  //     localRef.current.srcObject = localStream;
  //     remoteRef.current.srcObject = remoteStream;
  //     console.log(isMuteMicrophone);
  //   }
  //   handleK();
  // }, [isMuteMicrophone]);

  return (
    <div className="videos">
      <video ref={localRef} autoPlay playsInline className={`local`} muted />

      {/* <img
        ref={localRef}
        src="https://images.unsplash.com/photo-1695653420018-6fcd7709a268?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8"
        className={`local ${
          mode === "create" && isOffWebcam ? "block" : "hidden"
        }`}
      /> */}
      <video
        ref={remoteRef}
        autoPlay
        playsInline
        className={`w-full h-full remote`}
      />

      {/* <img
        ref={remoteRef}
        src="https://images.unsplash.com/photo-1695653420018-6fcd7709a268?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8"
        className={`w-full h-full remote ${isOffWebcam ? "block" : "hidden"}`}
      /> */}

      <div className="buttonsContainer">
        <button
          onClick={hangUp}
          disabled={!webcamActive}
          className="hangup button"
        >
          <HangupIcon />
        </button>
        {/* <button
          className="w-[76px] h-[76px] rounded-full bg-[#ff694f] flex items-center justify-center text-white"
          onClick={handleMute}
        >
          {mode === "create" ? (
            isMuteMicrophoneCaller ? (
              <BsFillMicMuteFill size={24} />
            ) : (
              <BsFillMicFill size={24} />
            )
          ) : isMuteMicrophone ? (
            <BsFillMicMuteFill size={24} />
          ) : (
            <BsFillMicFill size={24} />
          )}
        </button>
        <button className="w-[76px] h-[76px] rounded-full bg-[#ff694f] flex items-center justify-center text-white ml-[48px]">
          {isOffWebcam ? (
            <BsCameraVideoOff size={24} />
          ) : (
            <BsCameraVideo size={24} />
          )}
        </button> */}
      </div>

      {!webcamActive && (
        <div className="modalContainer">
          <div className="modal">
            <h3>Turn on your camera and microphone and start the call</h3>
            <div className="container">
              <button
                onClick={() => {
                  window.close();
                  setPage("home");
                }}
                className="secondary"
              >
                Cancel
              </button>
              <button onClick={setupSources}>Start</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;
