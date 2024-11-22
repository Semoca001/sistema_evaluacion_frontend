import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate(); // Hook para redirigir a otra página
  const [userName, setUserName] = useState(""); // Estado para almacenar el nombre del usuario
  const [userRole, setUserRole] = useState(""); // Estado para almacenar el rol del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar el estado de carga

  const user = JSON.parse(localStorage.getItem("user")); // Obtener los datos del usuario desde localStorage
  const userId = user?.id; // Obtener el ID del usuario desde localStorage
  const rolId = user?.rol_id; // Obtener el rol del usuario desde localStorage

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Eliminar todo el contenido del localStorage
    localStorage.clear();
    // Redirigir a la página de login
    navigate("/login");
  };

  useEffect(() => {
    if (userId) {
      // Llamar a la API para obtener el nombre del usuario
      axios
        .get(`http://localhost:5000/api/v1/users/${userId}`)
        .then((response) => {
          setUserName(response.data.nombre); // Guardar el nombre del usuario
        })
        .catch((error) => {
          console.error("Error al obtener el nombre del usuario", error);
        })
        .finally(() => setLoading(false));
    }

    // Determinar el rol del usuario
    if (rolId === 1) {
      setUserRole("Admin");
    } else if (rolId === 2) {
      setUserRole("User");
    }
  }, [userId, rolId]);

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-700 text-white flex flex-col p-6 space-y-8 shadow-lg">
      <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
        Dashboard
      </h1>

      {/* Mostrar nombre y rol del usuario alineado a la izquierda y más grande */}
      <div className="mt-6 mb-4">
        {loading ? (
          <p className="text-lg text-gray-300">Cargando...</p>
        ) : (
          <>
            <p className="text-2xl font-semibold text-gray-300">{userName}</p>
            <p className="text-xl text-gray-400">Rol: {userRole}</p>
          </>
        )}
      </div>

      <nav className="flex flex-col space-y-4">
        <h2 className="text-lg font-semibold text-gray-300">Menú Principal</h2>
        <Link
          to="/home/results-history"
          className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Ver Resultados Históricos
        </Link>
        <Link
          to="/home/manage-software"
          className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          Gestión de Software
        </Link>

        {rolId === 1 && (
          <>
            <h2 className="text-lg font-semibold text-gray-300 mt-6">Menú Admin</h2>
            <Link
              to="/home/manage-company"
              className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Gestión de Empresa
            </Link>
            <Link
              to="/home/manage-users"
              className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Gestión de Usuarios
            </Link>
          </>
        )}
      </nav>

      {/* Botón de cerrar sesión */}
      <button
        onClick={handleLogout}
        className="mt-auto py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded shadow-md transition-all duration-300 transform hover:scale-105"
      >
        Cerrar sesión
      </button>
    </aside>
  );
};

export default Sidebar;
