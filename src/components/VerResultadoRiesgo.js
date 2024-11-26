import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerResultadoRiesgo = () => {
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const tipoEncuestaId = JSON.parse(localStorage.getItem("results"))?.tipoEncuestaId;
    const encuestaId = JSON.parse(localStorage.getItem("results"))?.encuestaId;

    // Si el tipoEncuestaId no es igual a 2, redirigir al home
    if (tipoEncuestaId !== 2 || !encuestaId) {
      navigate("/home");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/v1/encuestas/${encuestaId}/resultados`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setResultados(response.data.categorias); // Guardar las categorías y sus preguntas
      })
      .catch((err) => {
        setError("Error al cargar los resultados.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <p className="text-gray-400">Cargando resultados...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Resultados de la Encuesta</h2>

      {/* Mostrar resultados */}
      {resultados && (
        <div className="mt-6">
          {Object.keys(resultados).map((categoriaName) => (
            <div
              key={categoriaName}
              className="mt-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg"
            >
              <h4 className="text-lg font-bold text-gray-200">{categoriaName}</h4>
              {resultados[categoriaName].map((resultado) => (
                <div
                  key={resultado.preguntaId}
                  className="mt-4 bg-gray-700 bg-opacity-80 p-3 rounded-lg shadow-sm"
                >
                  <p className="text-gray-300">
                    <strong>Pregunta:</strong> {resultado.contenido}
                  </p>
                  <p className="text-gray-300">
                    <strong>Respuesta:</strong> {resultado.respuesta}
                  </p>
                  <p className="text-gray-300">
                    <strong>Total Riesgo:</strong> {resultado.totalRiesgo}
                  </p>
                  <p className="text-gray-300">
                    <strong>Nivel de Riesgo:</strong>
                    <span
                      className={`
                        ${resultado.nivelRiesgo === "Bajo" ? "text-green-500" : ""}
                        ${resultado.nivelRiesgo === "Medio" ? "text-orange-500" : ""}
                        ${resultado.nivelRiesgo === "Alto" ? "text-red-800" : ""}
                        ${resultado.nivelRiesgo === "Muy Alto" ? "text-red-600" : ""}
                      `}
                    >
                      {resultado.nivelRiesgo}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Botón de volver al inicio */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/home")}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md focus:outline-none"
        >
          Ir al Inicio
        </button>
      </div>
    </div>
  );
};

export default VerResultadoRiesgo;
