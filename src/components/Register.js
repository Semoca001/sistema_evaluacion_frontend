import React, { useState } from "react";
import axios from "axios";
import { validateNombre, validateCorreo, validateContrasena } from "../utils/formValidations";
import "tailwindcss/tailwind.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from "react-router-dom"; // Importa Link para la navegación

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorContrasena, setErrorContrasena] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleNombreChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ\s]/g, '');
    setNombre(filteredValue);
    const error = validateNombre(filteredValue);
    setErrorNombre(error);
    validateForm(filteredValue, correo, contrasena, error, errorCorreo, errorContrasena);
  };

  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
    const error = validateCorreo(value);
    setErrorCorreo(error);
    validateForm(nombre, value, contrasena, errorNombre, error, errorContrasena);
  };

  const handleContrasenaChange = (e) => {
    const value = e.target.value;
    setContrasena(value);
    const error = validateContrasena(value);
    setErrorContrasena(error);
    validateForm(nombre, correo, value, errorNombre, errorCorreo, error);
  };

  const validateForm = (nombreValue, correoValue, contrasenaValue, errorNombreValue, errorCorreoValue, errorContrasenaValue) => {
    const isNombreValid = nombreValue && !errorNombreValue;
    const isCorreoValid = correoValue && !errorCorreoValue;
    const isContrasenaValid = contrasenaValue && !errorContrasenaValue;
    setIsSubmitDisabled(!(isNombreValid && isCorreoValid && isContrasenaValid));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSubmitDisabled) {
      try {
        await axios.post("http://localhost:5000/api/v1/users/register", {
          nombre,
          correo,
          contrasena,
          rol_id: 1,
        });
  
        setMessage("¡Registro exitoso! Bienvenido.");
        setMessageType("success");
  
        setNombre("");
        setCorreo("");
        setContrasena("");
        setErrorNombre("");
        setErrorCorreo("");
        setErrorContrasena("");
  
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
      } catch (error) {
        if (error.response) {
          setMessage(error.response.data.message || "Error al registrar el usuario.");
        } else {
          setMessage("Error al conectar con el servidor.");
        }
        setMessageType("error");
  
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
      }
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="max-w-sm w-full bg-gray-800 p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-200 mb-6">Registro de Usuario</h2>
        

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300" htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={handleNombreChange}
              maxLength="50"
              className="w-full p-3 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu nombre"
            />
            {errorNombre && <p className="text-red-400 text-sm mt-1">{errorNombre}</p>}
          </div>

          <div>
            <label className="block text-gray-300" htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={handleCorreoChange}
              maxLength="100"
              className="w-full p-3 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu correo"
            />
            {errorCorreo && <p className="text-red-400 text-sm mt-1">{errorCorreo}</p>}
          </div>

          <div>
            <label className="block text-gray-300" htmlFor="contrasena">Contraseña</label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="contrasena"
                value={contrasena}
                onChange={handleContrasenaChange}
                minLength="10"
                maxLength="20"
                className="w-full p-3 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200 focus:outline-none"
              >
                {isPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errorContrasena && <p className="text-red-400 text-sm mt-1">{errorContrasena}</p>}
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-md ${messageType === "success" ? 'bg-green-600' : 'bg-red-600'}`}>
              <p className="text-white text-center">{message}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className={`w-full p-3 mt-4 text-white rounded-md ${isSubmitDisabled ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Registrarse
            </button>
          </div>
        </form>

        {/* Agrega el mensaje con el enlace para ir al login */}
        <div className="mt-4 text-center text-gray-300">
          <p className="text-sm">
            ¿Ya tienes una cuenta? 
            <Link to="/login" className="text-blue-500 hover:text-blue-700">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
