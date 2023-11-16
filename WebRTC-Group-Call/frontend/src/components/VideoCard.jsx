import React, { useEffect, useRef } from "react";
const VideoCard = (props) => {
  const ref = useRef();
  const peer = props.peer;

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
    peer.on("track", (track, stream) => {});
  }, [peer]);

  return (
    <video autoPlay playsInline ref={ref} className="w-[800px] h-[800px]" />
  );
};

export default VideoCard;
