import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/users/empresa/${user.empresa_id}`,
          axiosConfig
        );
        const filteredUsers = response.data.filter((user) => user.rol_id !== 1); // Ocultar usuarios con rol_id 1
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.empresa_id]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/users/${id}`, axiosConfig);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (id, updatedUser) => {
    const newUsers = users.map((user) =>
      user.id === id ? { ...user, ...updatedUser } : user
    );
    setUsers(newUsers);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full p-6 text-white bg-opacity-80 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="px-4 py-2 border-b">ID</th>
            <th className="px-4 py-2 border-b">Nombre</th>
            <th className="px-4 py-2 border-b">Correo</th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-600">
              <td className="px-4 py-2 border-b">{user.id}</td>
              <td className="px-4 py-2 border-b">{user.nombre}</td>
              <td className="px-4 py-2 border-b">{user.correo}</td>
              <td className="px-4 py-2 border-b flex gap-2">
                <button
                  className="px-4 py-2 text-sm font-semibold text-gray-800 bg-yellow-400 rounded-md hover:bg-yellow-500"
                  onClick={() => handleEdit(user.id, { nombre: "Nuevo Nombre" })}
                >
                  Editar
                </button>
                <button
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                  onClick={() => handleDelete(user.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
