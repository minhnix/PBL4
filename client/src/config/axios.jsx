import axios from "axios";

const axiosConfig = () => {
  axios.defaults.baseURL = "http://localhost:8080/api/v1/";
  axios.defaults.headers.common["Content-Type"] = "application/json";
};

export default axiosConfig;
