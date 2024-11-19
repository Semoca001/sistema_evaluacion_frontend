// Validar el nombre: solo letras y longitud máxima de 50
export const validateNombre = (nombre) => {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;  // Expresión regular que permite solo letras y espacios
    if (!nombre) return "El nombre es obligatorio.";
    if (nombre.length > 50) return "El nombre no puede tener más de 50 caracteres.";
    if (!regex.test(nombre)) return "El nombre solo puede contener letras y espacios.";
    return "";  // Si todo está bien
  };
  
  // Validar el correo
  export const validateCorreo = (correo) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; // Expresión regular para el correo
    if (!correo) return "El correo es obligatorio.";
    if (!regex.test(correo)) return "Por favor ingresa un correo válido.";
    return "";  // Si todo está bien
  };
  
  // Validar la contraseña: mínimo 10 y máximo 20 caracteres
  export const validateContrasena = (contrasena) => {
    if (!contrasena) return "La contraseña es obligatoria.";
    if (contrasena.length < 10 || contrasena.length > 20) {
      return "La contraseña debe tener entre 10 y 20 caracteres.";
    }
    return "";  // Si todo está bien
  };
  