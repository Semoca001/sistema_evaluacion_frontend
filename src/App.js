import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";
import ManageCompany from "./components/ManageCompany";
import ManageUsers from "./components/ManageUsers";
import ManageSoftware from "./components/ManageSoftware";
import EncuestaCalidad from "./components/EncuestaCalidad";
import EncuestaRiesgo from "./components/EncuestaRiesgo";

const ROLE_ROUTES = {
  1: ["/home", "/home/manage-company", "/home/manage-users", "/home/manage-software"],
  2: ["/home", "/home/manage-software"],
  3: ["/home", "/home/manage-software"]
};

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const user = JSON.parse(userData);
    const currentPath = location.pathname;
    const isRouteAllowed = ROLE_ROUTES[user.rol_id]?.some(route => 
      currentPath.startsWith(route)
    );

    if (!isRouteAllowed) {
      return <Navigate to="/home" replace />;
    }

    return children;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

const HomeLayout = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.rol_id);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <Sidebar userRole={userRole} />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manage-software" element={<ManageSoftware />} />
          <Route path="/manage-company" element={
            userRole === 1 ? <ManageCompany /> : <Navigate to="/home" replace />
          } />
          <Route path="/manage-users" element={
            userRole === 1 ? <ManageUsers /> : <Navigate to="/home" replace />
          } />
          <Route path="/quality-evaluation" element={<EncuestaCalidad />} />
          <Route path="/risk-evaluation" element={<EncuestaRiesgo />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home/*" element={
          <ProtectedRoute>
            <HomeLayout />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;