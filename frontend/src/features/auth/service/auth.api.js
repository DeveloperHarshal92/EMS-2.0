import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function registerUser({ fname, email, password }) {
  const response = await api.post("/api/auth/register", {
    fname,
    email,
    password,
  });
  console.log(response.data)
  return response.data;
}

export async function loginUser({ email, password }) {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });
  console.log(response.data)
  return response.data;
}

export async function getUser() {
  const response = await api.get("/api/auth/get-profile");
  return response.data;
}

export const logout = async () => {
  await api.post("/api/auth/logout");
};
