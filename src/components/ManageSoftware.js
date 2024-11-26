import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageSoftware = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Obtenemos el objeto user desde localStorage
  const empresaId = user?.empresa_id;  // Obtenemos la empresa_id del usuario
  const creadorId = user?.id;          // Obtenemos el creador_id (id del usuario actual)
  const rolId = user?.rol_id;          // Obtenemos el rol_id del usuario
  const token = localStorage.getItem('token');  // Obtener el token del localStorage

  const [softwares, setSoftwares] = useState([]);
  const [newSoftwareName, setNewSoftwareName] = useState('');
  const [editingSoftware, setEditingSoftware] = useState(null);

  // Estado para almacenar los nombres de los creadores
  const [creators, setCreators] = useState({});

  // Determinar el endpoint según el rol
  let endpoint = '';
  if (rolId === 1) {
    endpoint = `http://localhost:5000/api/v1/software/empresa/${empresaId}`;
  } else if (rolId === 2) {
    endpoint = `http://localhost:5000/api/v1/software/empresa/${empresaId}/creador/${creadorId}`;
  }

  // Configuración para los headers con el token
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios.get(endpoint, { headers })
      .then(response => {
        const softwaresData = response.data;

        // Obtener los creadores de los softwares
        const creatorsPromises = softwaresData.map(software => 
          axios.get(`http://localhost:5000/api/v1/users/${software.creador_id}`, { headers })
            .then(res => ({ id: software.creador_id, name: res.data.nombre }))
            .catch(error => {
              console.error("Error al obtener el creador del software", error);
              return { id: software.creador_id, name: "Desconocido" };
            })
        );

        // Esperar a que todos los creadores se obtengan
        Promise.all(creatorsPromises).then(creatorsList => {
          const creatorsMap = creatorsList.reduce((acc, creator) => {
            acc[creator.id] = creator.name;
            return acc;
          }, {});
          
          setCreators(creatorsMap);
          setSoftwares(softwaresData);
        });
      })
      .catch(error => {
        console.error("Error al cargar los softwares", error);
      });
  }, [endpoint, token]);

  const handleCreateSoftware = () => {
    if (newSoftwareName) {
      axios.post('http://localhost:5000/api/v1/software', {
        nombre: newSoftwareName,
        empresa_id: empresaId,
        creador_id: creadorId,
      }, { headers })
      .then(response => {
        setSoftwares(prevSoftwares => [...prevSoftwares, response.data]);
        setNewSoftwareName('');
      })
      .catch(error => {
        console.error("Error al crear el software", error);
      });
    }
  };

  const handleEditSoftware = (software) => {
    setEditingSoftware(software);
  };

  const handleSaveEditedSoftware = () => {
    if (editingSoftware?.nombre) {
      axios.put(`http://localhost:5000/api/v1/software/${editingSoftware.id}`, editingSoftware, { headers })
        .then(response => {
          setSoftwares(prevSoftwares => prevSoftwares.map(software => software.id === editingSoftware.id ? response.data : software));
          setEditingSoftware(null);
        })
        .catch(error => {
          console.error("Error al editar el software", error);
        });
    }
  };

  const handleCancelEdit = () => {
    setEditingSoftware(null);
  };

  const isCreateButtonDisabled = !newSoftwareName || newSoftwareName.length > 50;  // Deshabilitar si el nombre está vacío o excede 50 caracteres

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-4xl bg-gray-800 bg-opacity-80 text-white rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Gestionar Software</h1>

          {/* Formulario para crear un nuevo software */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Crear Software</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nombre del nuevo software"
                value={newSoftwareName}
                onChange={(e) => setNewSoftwareName(e.target.value)}
                className="bg-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={50}  // Limitar a 50 caracteres
              />
            </div>
            {/* Notificación si el nombre excede los 50 caracteres */}
            {newSoftwareName.length > 50 && (
              <p className="text-red-500 mt-2">El nombre no puede exceder los 50 caracteres.</p>
            )}
            <button
              onClick={handleCreateSoftware}
              className={`mt-4 px-6 py-2 ${isCreateButtonDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} rounded-md text-white font-semibold`}
              disabled={isCreateButtonDisabled}  // Deshabilitar si el nombre está vacío o excede los 50 caracteres
            >
              Crear
            </button>
          </div>

          {/* Lista de softwares */}
          <div className="grid grid-cols-12 gap-2 text-center text-sm font-medium">
            {/* Cabecera */}
            <div className="col-span-4 border-b border-gray-700 py-2">Nombre</div>
            <div className="col-span-4 border-b border-gray-700 py-2">Creador</div>
            <div className="col-span-4 border-b border-gray-700 py-2">Acciones</div>

            {/* Filas */}
            {softwares.map((software) => (
              <React.Fragment key={software.id}>
                <div className="col-span-4 py-2">
                  {editingSoftware?.id === software.id ? (
                    <input
                      type="text"
                      value={editingSoftware.nombre}
                      onChange={(e) => setEditingSoftware({ ...editingSoftware, nombre: e.target.value })}
                      className="bg-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      maxLength={50}  // Limitar a 50 caracteres
                    />
                  ) : (
                    software.nombre
                  )}
                </div>
                <div className="col-span-4 py-2">
                  {creators[software.creador_id] || "Cargando..."}
                </div>
                <div className="col-span-4 py-2 flex justify-center gap-2">
                  {editingSoftware?.id === software.id ? (
                    <button
                      onClick={handleSaveEditedSoftware}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditSoftware(software)}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white font-semibold"
                    >
                      Editar
                    </button>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSoftware;
