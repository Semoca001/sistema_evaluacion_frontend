import React from "react";
import { Link } from "react-router-dom";

const Home = ({ userRole }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Barra lateral */}
      <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-700 text-white flex flex-col p-6 space-y-8 shadow-lg">
        <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          Dashboard
        </h1>
        <nav className="flex flex-col space-y-4">
          <h2 className="text-lg font-semibold text-gray-300">Menú Principal</h2>
          <Link
            to="/results-history"
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
                to="/create-company"
                className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Crear Empresa
              </Link>
              <Link
                to="/manage-users"
                className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Gestión de Usuarios
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-100 mb-8 text-center">
          Bienvenido a tu Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Botones con mejor apariencia */}
          <button className="py-4 px-6 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105">
            <Link to="/quality-evaluation">Evaluar Calidad</Link>
          </button>
          <button className="py-4 px-6 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105">
            <Link to="/risk-survey">Encuesta de Riesgo</Link>
          </button>
          <button className="py-4 px-6 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105">
            <Link to="/results-history">Resultados Históricos</Link>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
