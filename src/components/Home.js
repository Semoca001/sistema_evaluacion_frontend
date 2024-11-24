import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [softwares, setSoftwares] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState(null);
  const [selectedSurveyType, setSelectedSurveyType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Para manejar errores
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const empresaId = user?.empresa_id;
  const creadorId = user?.id;
  const rolId = user?.rol_id; // Recuperar el rol del usuario
  const token = localStorage.getItem("token"); // Obtener el token de acceso

  // Validar si el usuario no tiene empresa asignada y es administrador
  useEffect(() => {
    if (rolId === 1 && empresaId === null) {
      setError("Debes gestionar una empresa antes de continuar.");
      return;
    }
  }, [rolId, empresaId]);

  // Función para obtener los softwares del backend
  const fetchSoftwares = async () => {
    try {
      // Asegurándonos de que empresaId y creadorId estén disponibles
      if (!empresaId || !creadorId) {
        setError("No se encontraron datos de la empresa o el creador.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/v1/software/empresa/${empresaId}/creador/${creadorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setSoftwares(response.data);
      } else {
        setError("No se encontraron softwares disponibles.");
      }
    } catch (error) {
      console.error("Error al obtener los softwares:", error);
      setError("Ocurrió un error al obtener los softwares.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoftwares();
  }, [empresaId, creadorId, token]);

  // Función para abrir el modal de selección de encuesta
  const openModal = (software) => {
    setSelectedSoftware(software);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSurveyType(""); // Reset survey type after closing modal
  };

  // Función para manejar la selección de la encuesta
  const handleSurveySelection = () => {
    if (selectedSurveyType && selectedSoftware) {
      localStorage.setItem("software", JSON.stringify({ 
        id: selectedSoftware.id, 
        nombre: selectedSoftware.nombre 
      }));
      // Redirigir a la encuesta correspondiente
      if (selectedSurveyType === "calidad") {
        navigate("/home/quality-evaluation");
      } else if (selectedSurveyType === "riesgo") {
        navigate("/home/risk-evaluation");
      }
      closeModal();
    }
  };

  // Mostrar mensaje si el usuario es admin y no tiene empresa asignada
  if (rolId === 1 && empresaId === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">¡Acceso restringido!</h1>
          <p className="text-lg mb-4">
            Eres administrador, pero no tienes ninguna empresa asignada. Por favor, gestiona una empresa antes de continuar.
          </p>
          <button
            onClick={() => navigate("/home/manage-company")} // Redirigir a la ruta de gestión de empresa
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-all duration-300"
          >
            Ir a Gestionar Empresa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 bg-opacity-90">
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-4xl bg-gray-800 bg-opacity-90 text-white rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Evaluación de softwares</h1>
          
          {/* Mostrar errores si ocurre */}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {/* Cargando los softwares */}
          {loading ? (
            <p className="text-lg text-gray-300">Cargando software...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {softwares.length === 0 ? (
                <p className="text-lg text-gray-300"></p>
              ) : (
                softwares.map((software) => (
                  <div
                    key={software.id}
                    className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex justify-between items-center"
                  >
                    <h2 className="text-2xl font-semibold text-gray-200">{software.nombre}</h2>
                    <button
                      onClick={() => openModal(software)}
                      className="py-2 px-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300"
                    >
                      Evaluar
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal para seleccionar tipo de encuesta */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">
              Selecciona el tipo de encuesta para {selectedSoftware?.nombre}
            </h3>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setSelectedSurveyType("calidad")}
                className={`py-2 px-4 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ${
                  selectedSurveyType === "calidad"
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              >
                Encuesta de Calidad
              </button>
              <button
                onClick={() => setSelectedSurveyType("riesgo")}
                className={`py-2 px-4 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ${
                  selectedSurveyType === "riesgo"
                    ? "bg-blue-600 hover:bg-blue-500"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              >
                Encuesta de Riesgo
              </button>
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={closeModal}
                  className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSurveySelection}
                  className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition-all duration-300"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
