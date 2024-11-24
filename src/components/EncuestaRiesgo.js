import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EncuestaRiesgo = () => {
  const [cuestionario, setCuestionario] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false); // Para controlar si el formulario está listo para enviar
  const [isSubmitted, setIsSubmitted] = useState(false); // Para controlar si la encuesta fue enviada con éxito
  const navigate = useNavigate();

  useEffect(() => {
    const software = JSON.parse(localStorage.getItem("software"));

    if (!software || !software.id) {
      // Si no hay software o no tiene ID, redirige al usuario a /home
      navigate("/home");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    setLoading(true);

    axios
      .get("http://localhost:5000/api/v1/encuestas/riesgos/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCuestionario(response.data);
        // Inicializar respuestas vacías para cada pregunta
        const initialResponses = {};
        response.data.forEach((categoria) =>
          categoria.preguntas.forEach((pregunta) => {
            initialResponses[pregunta.id] = null;
          })
        );
        setRespuestas(initialResponses);
      })
      .catch((err) => {
        setError("Error al cargar el cuestionario.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleInputChange = (preguntaId, value) => {
    setRespuestas((prev) => {
      const updatedRespuestas = { ...prev, [preguntaId]: value };
      validateForm(updatedRespuestas);
      return updatedRespuestas;
    });
  };

  const validateForm = (responses) => {
    // Verifica si todas las preguntas tienen una respuesta
    const allAnswered = Object.values(responses).every((valor) => valor !== null);
    setIsFormValid(allAnswered);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const software = JSON.parse(localStorage.getItem("software"));
    const usuarioId = JSON.parse(localStorage.getItem("user")).id;

    try {
      // Crear la encuesta
      const encuestaResponse = await axios.post(
        "http://localhost:5000/api/v1/encuestas/riesgos",
        {
          creadorId: usuarioId,
          softwareId: software.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Obtener el ID de la encuesta creada
      const encuestaId = encuestaResponse.data.encuesta.id;

      // Enviar las respuestas
      const respuestasData = Object.keys(respuestas).map((preguntaId) => ({
        preguntaId,
        valor: respuestas[preguntaId],
      }));

      await axios.post(
        `http://localhost:5000/api/v1/encuestas/${encuestaId}/riesgos/responder`,
        {
          usuarioId, // Incluye usuarioId dentro del cuerpo
          respuestas: respuestasData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Eliminar la key software del localStorage solo si la respuesta fue exitosa
      localStorage.removeItem("software");

      // Establecer que la encuesta fue enviada
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error al enviar la encuesta:", error);
      alert("Hubo un problema al enviar la encuesta.");
    }
  };

  const handleGoHome = () => {
    navigate("/home"); // Redirigir al menú principal
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Encuesta de Riesgos</h2>

      {/* Mostrar preguntas */}
      {loading && <p className="text-gray-400">Cargando cuestionario...</p>}
      {cuestionario && (
        <div className="mt-6">
          {cuestionario.map((categoria) => (
            <div
              key={categoria.id}
              className="mt-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg"
            >
              <h4 className="text-lg font-bold text-gray-200">{categoria.nombre}</h4>
              <div className="mt-4 space-y-4">
                {categoria.preguntas.map((pregunta) => (
                  <div
                    key={pregunta.id}
                    className="flex flex-col bg-gray-700 bg-opacity-80 p-3 rounded-lg shadow-sm"
                  >
                    <label
                      htmlFor={`pregunta-${pregunta.id}`}
                      className="text-gray-300 mb-2"
                    >
                      {pregunta.contenido}
                    </label>
                    <div className="flex justify-between space-x-1">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <div key={val} className="flex items-center">
                          <input
                            type="radio"
                            id={`pregunta-${pregunta.id}-value-${val}`}
                            name={`pregunta-${pregunta.id}`}
                            value={val}
                            checked={respuestas[pregunta.id] === val}
                            onChange={() => handleInputChange(pregunta.id, val)}
                            className="mr-2 text-blue-500"
                          />
                          <label
                            htmlFor={`pregunta-${pregunta.id}-value-${val}`}
                            className="text-gray-300"
                          >
                            {val}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón de enviar o "Ir al inicio" según el estado */}
      <div className="mt-8 flex justify-center">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`${
              isFormValid
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed"
            } text-white py-2 px-6 rounded-md focus:outline-none`}
          >
            Enviar Encuesta
          </button>
        ) : (
          <button
            onClick={handleGoHome}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md focus:outline-none"
          >
            Ir al inicio
          </button>
        )}
      </div>
    </div>
  );
};

export default EncuestaRiesgo;

