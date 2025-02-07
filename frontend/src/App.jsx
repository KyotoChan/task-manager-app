import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Modules/Authentication/Login";
import Register from "./Modules/Authentication/Registeration";
import Preferences from "./Modules/Preferences/PreferenceMain";
import Notifications from "./Modules/Tasks/Tasks";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;