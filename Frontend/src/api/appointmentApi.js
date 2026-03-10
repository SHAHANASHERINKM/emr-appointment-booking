import axiosInstance from "./axiosInstance";

const appointmentApi = {
  getAppointments: (params) =>
    axiosInstance.get("/appointments", { params }),

  getAppointment: (id) =>
    axiosInstance.get(`/appointments/${id}`),

  createAppointment: (data) =>
    axiosInstance.post("/appointments", data),

  updateAppointment: (id, data) =>
    axiosInstance.put(`/appointments/${id}`, data),

  deleteAppointment: (id) =>
    axiosInstance.delete(`/appointments/${id}`),

  markArrived: (id) =>
    axiosInstance.post(`/appointments/${id}/arrive`),
};

export default appointmentApi;