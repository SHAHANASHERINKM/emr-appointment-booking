import axiosInstance from "./axiosInstance";

const slotApi = {
  getSlots: (doctorId, date) =>
    axiosInstance.get("/slots", { params: { doctorId, date } }),
};

export default slotApi;