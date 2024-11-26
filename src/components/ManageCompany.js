import React, { useState, useEffect } from "react";

const ManageCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Cargar datos de la empresa desde localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.empresa_id) {
      setCompanyId(user.empresa_id);
      setCompanyName(user.empresa?.nombre || "");
    }
  }, []);

  const handleCreateCompany = async () => {
    try {
      const adminId = JSON.parse(localStorage.getItem("user"))?.id;

      const response = await fetch("http://localhost:5000/api/v1/empresas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre: companyName, admin_id: adminId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar localStorage con los nuevos datos de la empresa
        const user = JSON.parse(localStorage.getItem("user")) || {};
        const updatedUser = {
          ...user,
          empresa: {
            id: data.id,
            nombre: data.nombre,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          },
          empresa_id: data.id,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Actualizar el estado
        setCompanyName(data.nombre);
        setCompanyId(data.id);

        setMessage("Empresa creada exitosamente.");
      } else {
        setMessage(data.message || "Error al crear la empresa.");
      }
    } catch (error) {
      setMessage("Error en la solicitud: " + error.message);
    }
  };

  const handleUpdateCompany = async () => {
    if (!companyId) {
      setMessage("ID de la empresa es necesario para actualizar.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/empresas/${companyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre: companyName }),
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar nombre de la empresa en localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        const updatedUser = {
          ...user,
          empresa: {
            ...user.empresa,
            nombre: companyName,
          },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setMessage("Empresa actualizada exitosamente.");
      } else {
        setMessage(data.message || "Error al actualizar la empresa.");
      }
    } catch (error) {
      setMessage("Error en la solicitud: " + error.message);
    }
  };

  // Función para manejar el cambio en el campo de nombre de la empresa
  const handleNameChange = (e) => {
    const newName = e.target.value;
    if (newName.length <= 50) {
      setCompanyName(newName);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-700 bg-opacity-70 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">Gestión de Empresa</h1>

        {!companyId ? (
          // Formulario para crear empresa
          <>
            <div className="mb-4">
              <label className="block mb-2 text-white">Nombre de la empresa:</label>
              <input
                type="text"
                className="border border-gray-300 p-2 w-full text-black rounded"
                value={companyName}
                onChange={handleNameChange} // Llamada a la nueva función
              />
              {companyName.length === 50 && (
                <p className="text-red-500 text-sm mt-1">El nombre no puede exceder los 50 caracteres.</p>
              )}
            </div>
            <button
              onClick={handleCreateCompany}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Crear Empresa
            </button>
          </>
        ) : (
          // Opciones de editar
          <>
            <div className="mb-4">
              <label className="block mb-2 text-white">Nombre de la empresa:</label>
              <input
                type="text"
                className="border border-gray-300 p-2 w-full text-black rounded"
                value={companyName}
                onChange={handleNameChange} // Llamada a la nueva función
              />
              {companyName.length === 50 && (
                <p className="text-red-500 text-sm mt-1">El nombre no puede exceder los 50 caracteres.</p>
              )}
            </div>
            <div className="space-x-4">
              <button
                onClick={handleUpdateCompany}
                className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
              >
                Actualizar Empresa
              </button>
            </div>
          </>
        )}

        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ManageCompany;
