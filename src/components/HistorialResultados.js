import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HistorialResultados = () => {
  const navigate = useNavigate(); // Usamos useNavigate para redirigir
  const user = JSON.parse(localStorage.getItem('user')); // Obtenemos el objeto user desde localStorage
  const empresaId = user?.empresa_id;  // Obtenemos la empresa_id del usuario
  const creadorId = user?.id;          // Obtenemos el creador_id (id del usuario actual)
  const rolId = user?.rol_id;          // Obtenemos el rol_id del usuario
  const token = localStorage.getItem('token');  // Obtener el token del localStorage

  const [encuestas, setEncuestas] = useState([]);

  // Determinar el endpoint según el rol
  let endpoint = '';
  if (rolId === 1) {
    endpoint = `http://localhost:5000/api/v1/encuestas/empresa/${empresaId}`;
  } else if (rolId === 2) {
    endpoint = `http://localhost:5000/api/v1/encuestas/empresa/${empresaId}/usuario/${creadorId}`;
  }

  // Configuración para los headers con el token
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios.get(endpoint, { headers })
      .then(response => {
        setEncuestas(response.data); // Guardamos la lista de encuestas
      })
      .catch(error => {
        console.error("Error al cargar las encuestas", error);
      }); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, token]);

  const handleViewResults = (encuestaId, tipoEncuestaId) => {
    // Almacenar la información en localStorage
    localStorage.setItem('results', JSON.stringify({
      encuestaId: encuestaId,
      tipoEncuestaId: tipoEncuestaId,
    }));
  
    // Redirigir a la página de resultados dependiendo del tipo de encuesta
    if (tipoEncuestaId === 1) {
      navigate('/home/view-results-quality');
    } else if (tipoEncuestaId === 2) {
      navigate('/home/view-results-risk');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-4xl bg-gray-800 bg-opacity-80 text-white rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Historial de Encuestas</h1>

          {/* Lista de encuestas */}
          <div className="grid grid-cols-12 gap-2 text-center text-sm font-medium">
            {/* Cabecera */}
            <div className="col-span-3 border-b border-gray-700 py-2">Software</div>
            <div className="col-span-3 border-b border-gray-700 py-2">Creador</div>
            <div className="col-span-3 border-b border-gray-700 py-2">Tipo de Encuesta</div>
            <div className="col-span-2 border-b border-gray-700 py-2">Modelo de Calidad</div>
            <div className="col-span-1 border-b border-gray-700 py-2">Acciones</div>

            {/* Filas de encuestas */}
            {encuestas.map((encuesta) => (
              <React.Fragment key={encuesta.id}>
                <div className="col-span-3 py-2">
                  {encuesta.software?.nombre || "Sin Software"}
                </div>
                <div className="col-span-3 py-2">
                  {encuesta.creador?.nombre || "Desconocido"}
                </div>
                <div className="col-span-3 py-2">
                  {encuesta.tipo_encuesta?.nombre || "Sin tipo"}
                </div>
                <div className="col-span-2 py-2">
                  {encuesta.modelo_calidad ? encuesta.modelo_calidad.nombre : "No disponible"}
                </div>
                <div className="col-span-1 py-2 flex justify-center">
                  <button
                    onClick={() => handleViewResults(encuesta.id, encuesta.tipo_encuesta.id)} // Pasa el id de la encuesta y el tipo de encuesta
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
                  >
                    Ver Resultados
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialResultados;
