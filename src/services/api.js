import axios from "axios";

const API = axios.create({
  // Replace with your own api or use my own and add the local url here
  baseURL: "https://calmora-api.vercel.app/api", 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------- AUTH --------
export const loginUser = (credentials) => API.post("/login", credentials);

// -------- ADMIN (specialist management) --------
export const getAllSpecialists = () => API.get("/admin/specialists");
export const getPendingSpecialists = () => API.get("/admin/specialists/pending");
export const getSpecialistById = (id) => API.get(`/admin/specialists/${id}`);
export const approveSpecialist = (id) =>
  API.put(`/admin/specialists/${id}/approve`);
export const rejectSpecialist = (id) =>
  API.put(`/admin/specialists/${id}/reject`);
export const deleteSpecialist = (id) =>
  API.delete(`/admin/specialists/${id}`);
