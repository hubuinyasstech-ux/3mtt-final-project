import { Routes, Route } from "react-router-dom";
import ScanQR from "./pages/ScanQR";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import GenerateQR from "./pages/GenerateQR";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/ScanQR" element={<ScanQR />} />
      <Route path="/GenerateQR" element={<GenerateQR />} />
    </Routes>
  );
}

export default App;
