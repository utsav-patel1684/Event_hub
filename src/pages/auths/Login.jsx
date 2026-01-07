import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPath = location.pathname.includes("/admin/login");

  const { loginAdmin, loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      let success = false;
      if (isAdminPath) {
        success = await loginAdmin(email, password);
      } else {
        success = await loginUser(email, password);
      }

      if (success) {
        toast.success("Welcome Back!");
        if(isAdminPath) {
          navigate("/admin");
        } else {
          navigate("/events");
        }
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        
        <h2 className="text-2xl font-black text-center mb-6 uppercase">
          {isAdminPath ? "Admin Portal" : "User Login"}
        </h2>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
          <button 
            onClick={() => navigate("/login")}
            className={`flex-1 py-2 rounded-lg font-bold ${!isAdminPath ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
          > User </button>
          <button 
            onClick={() => navigate("/admin/login")}
            className={`flex-1 py-2 rounded-lg font-bold ${isAdminPath ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
          > Admin </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
            {isAdminPath ? "ADMIN LOGIN" : "LOGIN"}
          </button>
        </form>

        {!isAdminPath && (
          <p className="mt-6 text-center text-sm">
            No account? <Link to="/register" className="text-indigo-600 font-bold">Register</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;