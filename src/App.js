import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home"; // Asegúrate de que la ruta sea correcta
import Login from "./components/Login"; // Importa el componente Login
import Register from "./components/Register"; // Importa el componente Register

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Recupera los datos del usuario desde localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserRole(parsedUser.rol_id); // Asigna el rol del usuario
    }
  }, []); // Se ejecuta una sola vez al montar el componente

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home userRole={userRole} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
