import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Cambia la URL base según sea necesario
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

// Añade más funciones según sea necesario para interactuar con el backend
