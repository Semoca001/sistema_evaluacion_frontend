import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerResultado = () => {
  const [resultados, setResultados] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tipoEncuestaId = JSON.parse(localStorage.getItem("results"))?.tipoEncuestaId;
    const encuestaId = JSON.parse(localStorage.getItem("results"))?.encuestaId;

    if (!tipoEncuestaId || tipoEncuestaId !== 1 || !encuestaId) {
      navigate("/home");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token. Inicia sesión nuevamente.");
      return;
    }

    axios
      .get(`http://localhost:5000/api/v1/encuestas/${encuestaId}/resultados`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setResultados(response.data);
      })
      .catch((err) => {
        setError("Error al cargar los resultados.");
        console.error(err);
      });
  }, [navigate]);

  const cleanCategoryName = (nombre) => {
    const keywordsToRemove = ["Furps", "Iso", "Six", "Boehm"];
    let cleanedName = nombre;
    keywordsToRemove.forEach((keyword) => {
      cleanedName = cleanedName.replace(new RegExp(keyword, "gi"), "").trim();
    });
    return cleanedName;
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!resultados) {
    return <p className="text-gray-400">Cargando resultados...</p>;
  }

  return (
    <div className="p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Resultados de la Encuesta</h2>
      
      {/* Mostrar datos globales fuera de las categorías */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className="text-xl text-gray-200 font-semibold mb-4">Resultados Globales</h3>
        <div className="space-y-2">
          <p className="text-gray-300">
            <strong>Ponderado Global:</strong> {resultados.ponderadoGlobal} %
          </p>
          <p
            className={`text-lg font-semibold ${
              resultados.nivelGlobal === "Excelente"
                ? "text-green-500"
                : resultados.nivelGlobal === "Muy Bueno"
                ? "text-green-300"
                : resultados.nivelGlobal === "Bueno"
                ? "text-blue-500"
                : resultados.nivelGlobal === "Insuficiente"
                ? "text-orange-500"
                : resultados.nivelGlobal === "Deficiente"
                ? "text-red-500"
                : "text-gray-300"
            }`}
          >
            <strong>Nivel de Calidad:</strong> {resultados.nivelGlobal}
          </p>
        </div>
      </div>

      {/* Se agrega margen en la parte superior de las categorías para separarlas */}
      <div className="space-y-6 mt-6">
        {/* Renderizar categorías */}
        {Object.entries(resultados.categorias).map(([categoria, data]) => (
          <div key={categoria} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl text-gray-200 font-semibold mb-4">
              {cleanCategoryName(categoria)} {/* Limpiar el nombre de la categoría */}
            </h3>
            <div className="space-y-3">
              {data.preguntas.map((pregunta) => (
                <div key={pregunta.preguntaId} className="p-3 bg-gray-700 rounded-lg shadow">
                  <p className="text-gray-300">{pregunta.contenido}</p>
                  <p className="text-gray-400">
                    Valor: <span className="font-semibold">{pregunta.valor}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Datos de la categoría */}
            <div className="mt-4 p-3 bg-gray-900 rounded-lg">
              <p className="text-gray-300">Puntos Máximos: {data.maximoPuntos}</p>
              <p className="text-gray-300">Puntaje: {data.valor}</p>
              <p className="text-gray-300">Nivel de Calidad de Parámetro: {data.promedioCategoria} %</p>
              <p className="text-gray-300">Nivel de Calidad Ponderado: {data.ponderado} %</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/home")}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md focus:outline-none"
        >
          Regresar al inicio
        </button>
      </div>
    </div>
  );
};

export default VerResultado;
