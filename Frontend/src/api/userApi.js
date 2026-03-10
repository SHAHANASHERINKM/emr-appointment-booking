import axiosInstance from "./axiosInstance";

const userApi = {
  getUsers: (params) =>
    axiosInstance.get("/users", { params }),

  createUser: (data) =>
    axiosInstance.post("/users", data),

  updateUser: (id, data) =>
    axiosInstance.put(`/users/${id}`, data),

  deleteUser: (id) =>
    axiosInstance.delete(`/users/${id}`),

  getDoctors: (params) =>
    axiosInstance.get("/doctors", { params }),

  getDoctorSchedule: (id) =>
    axiosInstance.get(`/doctors/${id}/schedule`),

  updateDoctorSchedule: (id, data) =>
    axiosInstance.put(`/doctors/${id}/schedule`, data),
};

export default userApi;