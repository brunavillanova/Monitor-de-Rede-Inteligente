import axios from "axios";

export const api = axios.create({
  baseURL: "https://monitor-de-rede-inteligente.onrender.com",
});