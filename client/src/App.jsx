import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import { StompProvider } from "usestomp-hook/lib";
import { config } from "./config/websocket.config";
import Videos from "./components/Videos";
import Room from "./pages/Room";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <StompProvider config={config}>
              <HomePage />
            </StompProvider>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/video"
          element={
            <StompProvider config={config}>
              <Videos />
            </StompProvider>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <StompProvider config={config}>
              <Room />
            </StompProvider>
          }
        />
      </Routes>
    </>
  );
}

export default App;
