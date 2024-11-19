import React, { useState } from "react";
import axios from "axios";
import { validateNombre, validateCorreo, validateContrasena } from "../utils/formValidations";
import "tailwindcss/tailwind.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
      </div>
    </div>
  );
};

export default Register;
