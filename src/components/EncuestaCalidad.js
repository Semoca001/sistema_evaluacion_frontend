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
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultados, setResultados] = useState(null); // Para almacenar los resultados
  const navigate = useNavigate();

  useEffect(() => {
    const software = JSON.parse(localStorage.getItem("software"));
    if (!software || !software.id) {
      navigate("/home");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró el token. Inicia sesión nuevamente.");
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
  }, [navigate]);

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
    const allAnswered = Object.values(responses).every(
      (valor) => valor !== null
    );
    setIsFormValid(allAnswered);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const software = JSON.parse(localStorage.getItem("software"));
    const usuarioId = JSON.parse(localStorage.getItem("user")).id;

    try {
      const encuestaResponse = await axios.post(
        "http://localhost:5000/api/v1/encuestas/",
        {
          modeloCalidadId: selectedModelo,
          softwareId: software.id,
          creadorId: usuarioId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const encuestaId = encuestaResponse.data.encuestaId;

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

      const resultadosResponse = await axios.get(
        `http://localhost:5000/api/v1/encuestas/${encuestaId}/resultados`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResultados(resultadosResponse.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error al enviar la encuesta:", error);
      alert("Hubo un problema al enviar la encuesta.");
    }
  };

  const handleGoToHome = () => {
    localStorage.removeItem("software");
    localStorage.removeItem("encuestaId");
    navigate("/home");
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
      {!isSubmitted ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-gray-100">
            Seleccionar Modelo de Calidad
          </h2>
          <div className="mb-6">
            <label
              htmlFor="modelo-calidad"
              className="block text-gray-300 mb-2"
            >
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
                                onChange={() =>
                                  handleInputChange(pregunta.id, val)
                                }
                                className="mr-2 transform scale-150 text-blue-500"
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
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4 text-gray-100">
            Resultados de la Encuesta
          </h2>
          <div className="space-y-6">
  {/* Mostrar datos globales fuera de las categorías */}
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
  <h3 className="text-xl text-gray-200 font-semibold mb-4">Resultados Globales</h3>
  <div className="space-y-2">
    <p className="text-gray-300">
      <strong>Ponderado Global:</strong> {resultados.ponderadoGlobal} %</p>
    
    {/* Asignar clase condicional al nivel global */}
    <p className={`text-lg font-semibold ${
      resultados.nivelGlobal === 'Excelente' ? 'text-green-500' :
      resultados.nivelGlobal === 'Muy Bueno' ? 'text-green-300' :
      resultados.nivelGlobal === 'Bueno' ? 'text-blue-500' :
      resultados.nivelGlobal === 'Insuficiente' ? 'text-orange-500' :
      resultados.nivelGlobal === 'Deficiente' ? 'text-red-500' :
      'text-gray-300'
    }`}>
      <strong>Nivel de Calidad:</strong> {resultados.nivelGlobal}
      </p>
  </div>
</div>

  {/* Se agrega margen en la parte superior de las categorías para separarlas */}
  <div className="space-y-6 mt-6"> {/* Aquí está el margen superior */}
    {/* Renderizar categorías */}
    {Object.entries(resultados.categorias).map(([categoria, data]) => (
      <div
        key={categoria}
        className="bg-gray-800 p-4 rounded-lg shadow-lg"
      >
        <h3 className="text-xl text-gray-200 font-semibold mb-4">
          {cleanCategoryName(categoria)} {/* Limpiar el nombre de la categoría */}
        </h3>
        <div className="space-y-3">
          {data.preguntas.map((pregunta) => (
            <div
              key={pregunta.preguntaId}
              className="p-3 bg-gray-700 rounded-lg shadow"
            >
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
</div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleGoToHome}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md focus:outline-none"
            >
              Regresar al inicio
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EncuestaCalidad;
