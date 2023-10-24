import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const StompContext = createContext();

function StompProvider({ children, config, onConnect, ...props }) {
  const [client, setClient] = useState(new Client(config));

  const send = (path, body, headers) => {
    client?.publish({
      destination: path,
      headers,
      body: JSON.stringify(body),
    });
  };

  const value = {
    client,
    send,
  };
  useEffect(() => {
    client?.activate();
    onConnect?.(client);
    return () => {
      client?.deactivate();
    };
  }, [client]);

  return (
    <StompContext.Provider value={value} {...props}>
      {children}
    </StompContext.Provider>
  );
}

function useStomp() {
  const context = useContext(StompContext);
  if (typeof context === "undefined")
    throw new Error("useStomp must be used within a StompProvider");
  return context;
}

export { StompProvider, useStomp };
