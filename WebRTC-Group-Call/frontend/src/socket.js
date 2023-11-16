import io from "socket.io-client";
const sockets = io("http://localhost:3001", {
  transports: ["websocket"], // Required when using Vite
});
export default sockets;
