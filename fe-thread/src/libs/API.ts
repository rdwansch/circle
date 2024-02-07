import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:3000" });

export const setAuthorization = (token: string) => {
  API.defaults.headers.common.Authorization = `Bearer ${token}`;
};
