import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EncuestaCalidad = () => {
  const [modelos, setModelos] = useState([]);
  const [selectedModelo, setSelectedModelo] = useState("");
  const [cuestionario, setCuestionario] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // eslint-disable-next-line
  const [encuestaId, setEncuestaId] = useState(null); // Para almacenar el ID de la encuesta
  const [isFormValid, setIsFormValid] = useState(false); // Para controlar si el formulario está listo para enviar
  const [popupVisible, setPopupVisible] = useState(false); // Para controlar la visibilidad del popup
  const [countdown, setCountdown] = useState(3); // Tiempo para la cuenta regresiva
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No se encontró el token. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/api/v1/encuestas", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModelos(response.data);
      })
      .catch((err) => {
        setError("Error al cargar los modelos de calidad.");
        console.error(err);
      });
  }, []);

  const handleSelectChange = async (event) => {
    const id = event.target.value;
    setSelectedModelo(id);
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/encuestas/cuestionario/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCuestionario(response.data);
      // Inicializar respuestas vacías para cada pregunta
      const initialResponses = {};
      response.data.categorias.forEach((categoria) =>
        categoria.preguntas.forEach((pregunta) => {
          initialResponses[pregunta.id] = null;
        })
      );
      setRespuestas(initialResponses);
    } catch (err) {
      setError("Error al cargar el cuestionario.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      // Primero, crear la encuesta
      const encuestaResponse = await axios.post(
        "http://localhost:5000/api/v1/encuestas/",
        {
          modeloCalidadId: selectedModelo,
          softwareId: software.id,
          creadorId: usuarioId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Obtener el ID de la encuesta
      const encuestaId = encuestaResponse.data.encuestaId;
      setEncuestaId(encuestaId);

      // Luego, enviar las respuestas
      const respuestasData = Object.keys(respuestas).map((preguntaId) => ({
        preguntaId,
        valor: respuestas[preguntaId],
      }));

      await axios.post(
        `http://localhost:5000/api/v1/encuestas/${encuestaId}/respuestas`,
        {
          usuarioId,
          respuestas: respuestasData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mostrar el popup de éxito y la cuenta regresiva
      setPopupVisible(true);
      setCountdown(3);

      // Limpiar el campo software en el localStorage
      localStorage.removeItem("software");

      // Iniciar la cuenta regresiva
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(countdownInterval);
            navigate("/home"); // Redirigir al menú principal
          }
          return prevCountdown - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error al enviar la encuesta:", error);
      alert("Hubo un problema al enviar la encuesta.");
    }
  };

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

  return (
    <div className="p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">
        Seleccionar Modelo de Calidad
      </h2>

      {/* Menú desplegable */}
      <div className="mb-6">
        <label htmlFor="modelo-calidad" className="block text-gray-300 mb-2">
          Modelo de Calidad:
        </label>
        <select
          id="modelo-calidad"
          value={selectedModelo}
          onChange={handleSelectChange}
          className="w-full p-3 border border-gray-700 bg-gray-800 text-gray-100 rounded shadow focus:outline-none focus:ring focus:ring-blue-600"
        >
          <option value="" disabled>
            Seleccione un modelo...
          </option>
          {modelos.map((modelo) => (
            <option key={modelo.id} value={modelo.id}>
              {modelo.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar preguntas */}
      {loading && <p className="text-gray-400">Cargando cuestionario...</p>}
      {cuestionario && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-100">
            Cuestionario: {cuestionario.nombre}
          </h3>
          {cuestionario.categorias.map((categoria) => (
            <div
              key={categoria.id}
              className="mt-4 bg-gray-800 bg-opacity-90 p-4 rounded-lg shadow-lg"
            >
              <h4 className="text-lg font-bold text-gray-200">
                {cleanCategoryName(categoria.nombre)}
              </h4>
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
                    <div className="flex justify-between space-x-3">
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

      {/* Botón de enviar */}
      <div className="mt-8 flex justify-center">
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
      </div>

      {/* Popup de éxito */}
      {popupVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">¡Encuesta creada con éxito!</h2>
            <p className="text-lg">Serás redirigido al menú principal en {countdown} segundos...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncuestaCalidad;
