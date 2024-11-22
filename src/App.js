import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Sidebar from "./components/Sidebar";

const HomeLayout = ({ userRole }) => (
  <div className="flex min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-200">
    <Sidebar userRole={userRole} />
    <Routes>
      <Route path="/" element={<Home userRole={userRole} />} />
      <Route path="/quality-evaluation" element={<div>Evaluación de Calidad</div>} />
      <Route path="/risk-survey" element={<div>Encuesta de Riesgo</div>} />
      <Route path="/results-history" element={<div>Historial de Resultados</div>} />
    </Routes>
  </div>
);

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Recupera los datos del usuario desde localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserRole(parsedUser.rol_id); // Asigna el rol del usuario
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas derivadas de /home */}
        <Route path="/home/*" element={<HomeLayout userRole={userRole} />} />
      </Routes>
    </Router>
  );
}

export default App;
