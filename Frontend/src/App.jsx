import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminPatients from "./pages/admin/AdminPatients";
import ManageUsers from "./pages/admin/ManageUsers";
import ReceptionistAppointments from "./pages/receptionist/ReceptionistAppointments";
import ReceptionistPatients from "./pages/receptionist/ReceptionistPatients";
import Scheduler from "./pages/receptionist/Scheduler";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import AdminLogs from "./pages/admin/AdminLogs";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/receptionist/dashboard" element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <ReceptionistDashboard />
          </ProtectedRoute>
        } />

        <Route path="/doctor/dashboard" element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/appointments" element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <AdminAppointments />
          </ProtectedRoute>
        } />


        <Route path="/admin/patients" element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <AdminPatients />
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <ManageUsers />
          </ProtectedRoute>
        } />

        <Route path="/receptionist/appointments" element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <ReceptionistAppointments />
          </ProtectedRoute>
        } />
        <Route path="/receptionist/patients" element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <ReceptionistPatients />
          </ProtectedRoute>
        } />

        <Route path="/receptionist/scheduler" element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <Scheduler />
          </ProtectedRoute>
        } />

        <Route path="/doctor/appointments" element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorAppointments />
          </ProtectedRoute>
        } />

        <Route path="/admin/logs" element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <AdminLogs />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;