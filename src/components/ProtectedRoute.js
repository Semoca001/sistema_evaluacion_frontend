import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // Redirige a /login si no está autenticado
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;
