import HomePage from "./components/Homepage";
import Main from "./components/Main";
import Room from "./components/Room";
import React from "react";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
