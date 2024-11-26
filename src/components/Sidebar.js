import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome, FaBars } from "react-icons/fa"; // Iconos

const Sidebar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Controla el estado del sidebar en pantallas pequeñas

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const rolId = user?.rol_id;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Alterna el estado del sidebar
  };

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:5000/api/v1/users/${userId}`)
        .then((response) => {
          setUserName(response.data.nombre);
        })
        .catch((error) => {
          console.error("Error al obtener el nombre del usuario", error);
        })
        .finally(() => setLoading(false));
    }

    if (rolId === 1) {
      setUserRole("Admin");
    } else if (rolId === 2) {
      setUserRole("User");
    }
  }, [userId, rolId]);

  return (
    <>
      {/* Botón para abrir/cerrar el sidebar en dispositivos pequeños */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-4 text-white bg-gray-800 hover:bg-gray-700 transition-all duration-300 transform rounded-full absolute top-6 left-6 z-50"
      >
        <FaBars />
      </button>

      <aside
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } lg:block w-64 bg-gradient-to-b from-gray-800 to-gray-700 text-white flex flex-col p-6 space-y-8 shadow-lg transition-all duration-300 transform`}
      >
        <h1
          onClick={() => navigate("/home")}
          className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 cursor-pointer mb-6"
        >
          Dashboard
        </h1>

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
            to="/home/historial-resultados"
            className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md bg-opacity-80"
          >
            Historial de Resultados
          </Link>
          <Link
            to="/home/manage-software"
            className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md bg-opacity-80"
          >
            Gestión de Software
          </Link>

          {rolId === 1 && (
            <>
              <h2 className="text-lg font-semibold text-gray-300 mt-6">Menú Admin</h2>
              <Link
                to="/home/manage-company"
                className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md bg-opacity-80"
              >
                Gestión de Empresa
              </Link>
              <Link
                to="/home/manage-users"
                className="py-2 px-4 rounded bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-md bg-opacity-80"
              >
                Gestión de Usuarios
              </Link>
            </>
          )}
        </nav>

        {/* Botones "Ir a Inicio" y "Cerrar sesión" al final */}
        <div className="mt-auto flex flex-col space-y-4">
          <Link
            to="/home"
            className="flex items-center py-2 px-4 rounded bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 transition-all duration-300 transform hover:scale-105 shadow-md bg-opacity-80"
          >
            <FaHome className="mr-3" />
            Ir a Inicio
          </Link>

          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded shadow-md transition-all duration-300 transform hover:scale-105"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
