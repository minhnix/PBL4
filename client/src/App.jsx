import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import { StompProvider } from "usestomp-hook/lib";
import { config } from "./config/websocket.config";

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
        <Route path="/messages" element={<SignIn />} />
      </Routes>
    </>
  );
}

export default App;
