import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Login from "../Pages/auths/Login";
import Events from "../Pages/user/Events";
import AdminDashboard from "../Pages/Admin/AdminDashboard";

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<Login />} />

      {/* User Protected Route */}
      <Route 
        path="/events" 
        element={user ? <Events /> : <Navigate to="/login" />} 
      />

      {/* Admin Protected Route (Yahan /admin use kiya hai) */}
      <Route 
        path="/admin" 
        element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  
  );
};

export default AppRouter;