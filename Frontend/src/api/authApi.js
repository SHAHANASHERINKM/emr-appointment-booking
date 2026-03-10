import axiosInstance from "./axiosInstance";

const authApi = {
  login: (email, password) =>
    axiosInstance.post("/auth/login", { email, password }),

  logout: (refreshToken) =>
    axiosInstance.post("/auth/logout", { refreshToken }),

  getMe: () =>
    axiosInstance.get("/auth/me"),

  refresh: (refreshToken) =>
    axiosInstance.post("/auth/refresh", { refreshToken }),
};

export default authApi;