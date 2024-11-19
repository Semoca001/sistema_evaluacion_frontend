import { useState } from "react";
import { validateNombre, validateCorreo, validateContrasena } from "../utils/formValidations";

export const useForm = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorContrasena, setErrorContrasena] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleNombreChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ\s]/g, '');
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

  const validateForm = () => {
    if (!errorNombre && !errorCorreo && !errorContrasena && nombre && correo && contrasena) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  };

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
