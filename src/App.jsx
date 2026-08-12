import { Routes, Route } from "react-router-dom";
import ScanQR from "./pages/ScanQR";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import GenerateQR from "./pages/GenerateQR";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <Layout>
              <Attendance />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/ScanQR"
        element={
          <ProtectedRoute>
            <Layout>
              <ScanQR />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/GenerateQR"
        element={
          <ProtectedRoute>
            <Layout>
              <GenerateQR />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Layout>
              <Students />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <Layout>
              <Teachers />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
