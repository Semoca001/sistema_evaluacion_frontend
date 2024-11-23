import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ nombre: '', correo: '', contrasena: '', empresa_id: null });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/users/empresa/${user.empresa_id}`, axiosConfig);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [user.empresa_id]);

  const handleCreateUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/add-user', { ...newUser, empresa_id: user.empresa_id }, axiosConfig);
      setUsers((prev) => [...prev, response.data]);
      setNewUser({ nombre: '', correo: '', contrasena: '', empresa_id: null });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/v1/users/${id}`, editingUser, axiosConfig);
      setUsers((prev) => prev.map((user) => (user.id === id ? response.data : user)));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/users/${id}`, axiosConfig);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter((user) => user.rol_id !== 1);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-4xl bg-gray-800 bg-opacity-80 text-white rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Manage Users</h1>

          {/* Formulario para crear usuario */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={newUser.nombre}
                onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                className="bg-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Correo"
                value={newUser.correo}
                onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })}
                className="bg-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={newUser.contrasena}
                onChange={(e) => setNewUser({ ...newUser, contrasena: e.target.value })}
                className="bg-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCreateUser}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold"
            >
              Create
            </button>
          </div>

          {/* Tabla de usuarios */}
          <div className="grid grid-cols-12 gap-2 text-center text-sm font-medium">
            {/* Cabecera */}
            <div className="col-span-2 border-b border-gray-700 py-2">ID</div>
            <div className="col-span-4 border-b border-gray-700 py-2">Nombre</div>
            <div className="col-span-4 border-b border-gray-700 py-2">Correo</div>
            <div className="col-span-2 border-b border-gray-700 py-2">Acciones</div>

            {/* Filas */}
            {filteredUsers.map((user) => (
              <React.Fragment key={user.id}>
                <div className="col-span-2 py-2">{user.id}</div>
                <div className="col-span-4 py-2">
                  {editingUser?.id === user.id ? (
                    <input
                      type="text"
                      value={editingUser.nombre}
                      onChange={(e) => setEditingUser({ ...editingUser, nombre: e.target.value })}
                      className="bg-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  ) : (
                    user.nombre
                  )}
                </div>
                <div className="col-span-4 py-2">
                  {editingUser?.id === user.id ? (
                    <input
                      type="email"
                      value={editingUser.correo}
                      onChange={(e) => setEditingUser({ ...editingUser, correo: e.target.value })}
                      className="bg-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    />
                  ) : (
                    user.correo
                  )}
                </div>
                <div className="col-span-2 py-2 flex justify-center gap-2">
                  {editingUser?.id === user.id ? (
                    <button
                      onClick={() => handleUpdateUser(user.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingUser(user)}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white font-semibold"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold"
                  >
                    Delete
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

export default ManageUsers;
