import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import { StompProvider } from "usestomp-hook/lib";
import { config } from "./config/websocket.config";
import Videos from "./components/Videos";

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
      </Routes>
    </>
  );
}

export default App;
