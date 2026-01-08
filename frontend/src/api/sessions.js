import axiosInstance from "../util/axios";

export const sessionApi = {
  createSession: async (data) => {
    const response = await axiosInstance.post("/sessions", data);
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/active");
    return response.data;
  },
  getMyRecentSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-recent");
    return response.data;
  },

  getSessionById: async (id) => {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
  },

  joinSession: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/join`);
    return response.data;
  },
  endSession: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/end`);
    return response.data;
  },
  getStreamToken: async () => {
    const response = await axiosInstance.get(`/chat/token`);
    return response.data;
  },
  getSessionRecordings: async (id) => {
    const response = await axiosInstance.get(`/sessions/${id}/recordings`);
    return response.data;
  },
  getAllRecordings: async () => {
    const response = await axiosInstance.get("/sessions/admin/all-recordings");
    return response.data;
  },
};

export const getSessionRecordings = (id) => sessionApi.getSessionRecordings(id);
export const getAllRecordings = () => sessionApi.getAllRecordings();