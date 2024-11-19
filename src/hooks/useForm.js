import { useState } from "react";
import { validateNombre, validateCorreo, validateContrasena } from "../utils/formValidations"; // Asegúrate de que la ruta sea correcta

// Este hook manejará el estado y las validaciones del formulario
export const useForm = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorContrasena, setErrorContrasena] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Validaciones
  const handleNombreChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ\s]/g, ''); // Solo letras y espacios
    setNombre(filteredValue);
    const error = validateNombre(filteredValue);
    setErrorNombre(error);
    validateForm();
  };

  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setCorreo(value);
    const error = validateCorreo(value);
    setErrorCorreo(error);
    validateForm();
  };

  const handleContrasenaChange = (e) => {
    const value = e.target.value;
    setContrasena(value);
    const error = validateContrasena(value);
    setErrorContrasena(error);
    validateForm();
  };

  // Verifica si el formulario es válido
  const validateForm = () => {
    if (!errorNombre && !errorCorreo && !errorContrasena && nombre && correo && contrasena) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };

  // Este hook retorna todo lo necesario para controlar el formulario
  return {
    nombre,
    correo,
    contrasena,
    errorNombre,
    errorCorreo,
    errorContrasena,
    isSubmitDisabled,
    handleNombreChange,
    handleCorreoChange,
    handleContrasenaChange
  };
};
