import axios, { AxiosError, AxiosResponse } from 'axios';

const axiosClient = axios.create();
axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 403) {
      window.location.href = '/login';
      localStorage.clear();
    }
    if (error.response?.status === 401) {
      window.location.href = '/login';
      localStorage.clear();
    } else {
    }
    throw new Error(error.response?.data.message || error.message);
  }
);

export default axiosClient;
