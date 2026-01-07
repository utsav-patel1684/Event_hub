import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const { loginAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginAdmin(email, password);
    if (success) {
      toast.success("Admin access granted!");
      navigate("/admin");
    } else {
      toast.error("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-200">
        
        {/* SIMPLE TOGGLE TABS */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
          <button 
            type="button"
            onClick={() => navigate("/login")}
            className="flex-1 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700"
          >
            User Login
          </button>
          <button 
            type="button"
            className="flex-1 py-2 text-sm font-bold bg-white shadow-sm rounded-md text-gray-900 border border-gray-200"
          >
            Admin Access
          </button>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Admin Portal</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              Admin Email
            </label>
            <input
              type="email"
              placeholder="admin@system.com"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-1 focus:ring-black outline-none transition-all"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              Secure Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-1 focus:ring-black outline-none transition-all"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition-colors disabled:bg-gray-400 mt-2"
          >
            {loading ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;