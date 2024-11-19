import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    // Lógica de autenticación aquí
    if (!email || !password) {
      setError("Por favor, ingresa todos los campos.");
      return;
    }
    // Aquí puedes hacer una petición al backend
    console.log("Autenticando usuario", email, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Iniciar sesión</h2>
        
        {/* Formulario de login */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Iniciar sesión
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-700">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
