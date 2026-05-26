import axios from "axios";

const API = axios.create({
  baseURL: "https://6a152baa91ff9a63de0791b7.mockapi.io"
});

export default API;