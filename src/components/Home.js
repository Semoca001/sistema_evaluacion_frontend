import React from "react";
import { Link } from "react-router-dom";

const Home = ({ userRole }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Título principal */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Bienvenido a tu Dashboard
      </h1>

      {/* Menú Principal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">Menú Principal</h2>
          <div className="mt-4 space-y-3">
            {/* Enlaces del menú */}
            <Link
              to="/create-software"
              className="block text-blue-600 hover:text-blue-800"
            >
              Crear Software
            </Link>
            <Link
              to="/quality-evaluation"
              className="block text-blue-600 hover:text-blue-800"
            >
              Evaluar Calidad
            </Link>
            <Link
              to="/risk-survey"
              className="block text-blue-600 hover:text-blue-800"
            >
              Realizar Encuesta de Riesgo
            </Link>
            <Link
              to="/results-history"
              className="block text-blue-600 hover:text-blue-800"
            >
              Ver Resultados Históricos
            </Link>
          </div>
        </div>

        {/* Menú Admin (solo si el rol es admin) */}
        {userRole === "1" && (
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700">Menú Admin</h2>
            <div className="mt-4 space-y-3">
              {/* Enlaces de administración */}
              <Link
                to="/create-company"
                className="block text-blue-600 hover:text-blue-800"
              >
                Crear Empresa
              </Link>
              <Link
                to="/manage-users"
                className="block text-blue-600 hover:text-blue-800"
              >
                Gestión de Usuarios
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

