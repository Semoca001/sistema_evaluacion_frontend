import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home"; // Asegúrate de que la ruta sea correcta
import Login from "./components/Login"; // Importa el componente Login
import Register from "./components/Register"; // Importa el componente Register

function App() {
  const [userRole] = useState("admin"); // Esto debe venir del sistema de autenticación

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home userRole={userRole} />} />
        <Route path="/login" element={<Login />} /> {/* Ruta para Login */}
        <Route path="/register" element={<Register />} /> {/* Ruta para Register */}
      </Routes>
    </Router>
  );
}

export default App;


