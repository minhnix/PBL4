import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import Videos from "./components/VideoCallVideos";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/messages" element={<SignIn />} />
        <Route path="/video" element={<Videos />} />
      </Routes>
    </>
  );
}

export default App;
