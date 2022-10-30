import axiosClient from ".";

const authApi = {
  login: (username, password) => {
    return axiosClient.post("/login", { username, password });
  },
  register: (formData) => {
    return axiosClient.post("/register", formData);
  },
  get: () => {
    return axiosClient.get("/user");
  },
};

export default authApi;
