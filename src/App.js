import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

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
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ruta para la página de inicio, ya no está protegida */}
        <Route path="/home" element={<Home userRole={userRole} />} />
      </Routes>
    </Router>
  );
}

export default App;
