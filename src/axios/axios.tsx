import axios from "axios";

const BASE_URL = "https://flipkartserverdelpoyed.herokuapp.com/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
