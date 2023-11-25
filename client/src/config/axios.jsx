import axios from "axios";
import { SERVER_URL } from ".";

const axiosConfig = () => {
  axios.defaults.baseURL = SERVER_URL + "/api/v1/";
  axios.defaults.headers.common["Content-Type"] = "application/json";
};

export default axiosConfig;
