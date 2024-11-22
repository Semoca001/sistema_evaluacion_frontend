import React from "react";
import { Link } from "react-router-dom";

const Home = ({ userRole }) => {
  return (
    <main className="flex-1 p-8">
      <h1 className="text-4xl font-bold text-gray-100 mb-8 text-center">
        Bienvenido a tu Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Botones con mejor apariencia */}
        <button className="py-4 px-6 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105">
          <Link to="/home/quality-evaluation">Evaluar Calidad</Link>
        </button>
        <button className="py-4 px-6 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105">
          <Link to="/home/risk-survey">Encuesta de Riesgo</Link>
        </button>
        <button className="py-4 px-6 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105">
          <Link to="/home/results-history">Resultados Históricos</Link>
        </button>
      </div>
    </main>
  );
};

export default Home;


