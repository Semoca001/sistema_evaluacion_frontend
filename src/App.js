import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home"; // Asegúrate de que la ruta sea correcta

function App() {
  const [userRole] = useState("admin"); // Esto debe venir del sistema de autenticación

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home userRole={userRole} />} />
      </Routes>
    </Router>
  );
}

export default App;

