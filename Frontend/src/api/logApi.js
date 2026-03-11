import axiosInstance from "./axiosInstance";

const logApi = {
    getLogs: (params) => axiosInstance.get("/logs", { params }),
};

export default logApi;