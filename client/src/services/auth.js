import instance from "./axios";

export const login = async (credentials) => {
  try {
    const response = await instance.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Login failed");
  }
};

export const register = async (userData) => {
  try {
    const response = await instance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Registration failed");
  }
};
