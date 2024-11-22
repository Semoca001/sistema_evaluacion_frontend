// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ userRole }) => {
  return (
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-700 text-white flex flex-col p-6 space-y-8 shadow-lg">
      <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
        Dashboard
      </h1>
      <nav className="flex flex-col space-y-4">
        <h2 className="text-lg font-semibold text-gray-300">Menú Principal</h2>
        <Link
          to="/home/results-history"
          className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Ver Resultados Históricos
        </Link>
        {userRole === 1 && (
          <>
            <h2 className="text-lg font-semibold text-gray-300 mt-6">
              Menú Admin
            </h2>
            <Link
              to="/home/create-company"
              className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Crear Empresa
            </Link>
            <Link
              to="/home/manage-users"
              className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Gestión de Usuarios
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
