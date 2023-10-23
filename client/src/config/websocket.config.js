const token = localStorage.getItem("token");

export const config = {
  connectHeaders: {
    Authorization: "Bearer " + token,
  },
  brokerURL: "ws://localhost:8080/ws",
  reconnectDelay: 10000,
  heartbeatOutgoing: 5000,
  heartbeatIncoming: 5000,
  debug: function (str) {
    console.log("STOMP DEBUG: " + str);
  },
  onStompError: function (err) {
    console.error(err);
  },
};
