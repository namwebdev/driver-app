import axiosClient from "./";

const tripApi = {
  get: (id) => {
    return axiosClient.get(`/trip/${id}`);
  },
  getByPhone: (phone) => {
    return axiosClient.get(`/trip`, { params: { client_phone_number: phone } });
  },
  getByDriverId: (id) => {
    return axiosClient.get("/trip", { params: { driver_id: id } });
  },
  book: (data) => {
    return axiosClient.post("/trip/create", data);
  },
  update: (id, data) => {
    return axiosClient.put(`/trip/update/${id}`, data);
  },
};

export default tripApi;
