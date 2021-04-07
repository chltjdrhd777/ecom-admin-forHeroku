import axios from "axios";
/* 
const BASE_URL = "https://flipkartserverdelpoyed.herokuapp.com/api";
 */
const BASE_URL = window.location.hostname === "localhost" ? "http://localhost:8080/api" : "https://flipkartserverdelpoyed.herokuapp.com/api";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export default axiosInstance;
