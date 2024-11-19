import React, { useState } from "react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validación simple de los campos
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, ingresa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Aquí puedes hacer la solicitud a tu backend para registrar al usuario
    console.log("Registrando usuario", name, email, password);
    
    // Simulación de éxito (en la vida real, es donde manejarías la respuesta del backend)
    setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
    setError("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear Cuenta</h2>

        {/* Formulario de registro */}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          <div className="mb-4">
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

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Mostrar errores */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {/* Mostrar mensaje de éxito */}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Registrarse
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-700">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

