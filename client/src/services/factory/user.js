import axiosClient from "./";

const userApi = {
  register: (form) => {
    return axiosClient.post("/register", form);
  },
  getById: (id) => {
    return axiosClient.get("/user/" + id);
  },
  update: (id, data) => {
    return axiosClient.put("/user/update/" + id, data);
  },
};

export default userApi;
