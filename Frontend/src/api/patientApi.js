import axiosInstance from "./axiosInstance";

const patientApi = {
  searchPatients: (q = "") =>
    axiosInstance.get("/patients/search", { params: { q } }),

  getPatient: (id) =>
    axiosInstance.get(`/patients/${id}`),

  getPatientCount: () =>
    axiosInstance.get("/patients/count"),

  createPatient: (data) =>
    axiosInstance.post("/patients", data),

  updatePatient: (id, data) =>
    axiosInstance.put(`/patients/${id}`, data),
};

export default patientApi;