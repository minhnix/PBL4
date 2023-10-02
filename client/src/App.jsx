import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/messages" element={<SignIn />} />
      </Routes>
    </>
  );
}

export default App;
