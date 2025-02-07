import axios from "axios";
import { notifyError } from "./toastService";

const httpClient = axios.create({
  baseURL: "http://localhost:3000/api", // Replace with your API base URL
  timeout: 10000,
});

httpClient.interceptors.response.use(
  (response) => response.data, // Automatically return the response data
  (error) => {
    // Extract and show error message
    const message =
      error.response?.data?.message || "Something went wrong. Please try again.";
    notifyError(message);

    // Propagate error for further handling if needed
    return Promise.reject(error);
  }
);

export default httpClient;