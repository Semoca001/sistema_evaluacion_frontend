import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validateCorreo } from "../utils/formValidations";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importar los íconos de react-icons
import "tailwindcss/tailwind.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [userDetails, setUserDetails] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para visibilidad de la contraseña

  const navigate = useNavigate();

  const handleCorreoChange = (e) => {
    const value = e.target.value.slice(0, 50);
    setEmail(value);
    const error = validateCorreo(value);
    setErrorCorreo(error);
    validateForm(value, password, error);
  };

  const handleContrasenaChange = (e) => {
    const value = e.target.value.slice(0, 20);
    setPassword(value);
    validateForm(email, value, errorCorreo);
  };

  const validateForm = (emailValue, passwordValue, errorCorreoValue) => {
    const isCorreoValid = emailValue && !errorCorreoValue;
    const isContrasenaValid = passwordValue.length > 0;
    setIsSubmitDisabled(!(isCorreoValid && isContrasenaValid));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState); // Alternar visibilidad
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSubmitDisabled) {
      try {
        const response = await axios.post("http://localhost:5000/api/v1/users/login", {
          correo: email,
          contrasena: password,
        });

        if (response.data.success || response.data.token) {
          setMessage("Inicio de sesión exitoso.");
          setMessageType("success");

          const { token, user } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          setUserDetails(user);
          navigate("/home");
        }
      } catch (error) {
        if (error.response) {
          setMessage(error.response.data.message || "Correo o contraseña incorrectos.");
        } else {
          setMessage("Error al conectar con el servidor.");
        }
        setMessageType("error");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-300">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              maxLength="50"
              className="mt-2 p-3 w-full border border-gray-700 rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={handleCorreoChange}
            />
            {errorCorreo && <p className="text-red-400 text-sm mt-1">{errorCorreo}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"} // Alternar entre texto y contraseña
                id="password"
                maxLength="20"
                className="mt-2 p-3 w-full border border-gray-700 rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu contraseña"
                value={password}
                onChange={handleContrasenaChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />} {/* Íconos para mostrar/ocultar */}
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-center ${messageType === "success" ? "bg-green-600" : "bg-red-600"}`}>
              <p className="text-white">{message}</p>
            </div>
          )}

          {userDetails && (
            <div className="mt-4 p-3 rounded-md bg-gray-700">
              <p className="text-gray-200 text-sm">
                Bienvenido, <strong>{userDetails.nombre}</strong> (Rol: {userDetails.rol && userDetails.rol.nombre})
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full p-3 text-white rounded-md ${isSubmitDisabled ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              Iniciar sesión
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-500 hover:text-blue-600">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
