import axiosClient from "./";

const userApi = {
  getById: (id) => {
    return axiosClient.get("/user/" + id);
  },
  update: (id, data) => {
    return axiosClient.put("/user/update/" + id, data);
  },
};

export default userApi;
