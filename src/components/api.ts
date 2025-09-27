import axios from "axios";
import SecureStorage from "react-secure-storage";



// Apilar va versiyalar
const  baby = "https://api.babyortomed.one-med.uz"
const  bm = "https://api.bm.one-med.uz"
const titan = "https://api.titan-renesans.one-med.uz"
const nero = "https://api.nerolife.one-med.uz"


console.log(baby, bm, titan, nero)

const api = axios.create({
  baseURL: bm,
});
// https://api.babyortomed.one-med.uz   /// 8080
// https://api.bm.one-med.uz   /// 8081
// https://api.titan-renesans.one-med.uz   /// 8082
// https://api.nerolife.one-med.uz   /// 8083

// Har bir so‘rovga access token qo‘shish
api.interceptors.request.use(
  async (config) => {
    const token = SecureStorage.getItem("accessToken");
    // console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Agar 401 (Unauthorized) bo'lsa, tokenni yangilash
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Access token eskirgan, yangilanmoqda...");

      const refreshToken = SecureStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.log("Refresh token yo‘q, login sahifasiga yo‘naltirilmoqda...");
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${bm}/v1/auth/login`,
          { refresh: refreshToken }
        );

        const newAccessToken = response.data.access_token;
        SecureStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // Oldingi so‘rovni qayta yuborish
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(error.config);
      } catch (refreshError) {
        console.error("Refresh token eskirgan yoki noto‘g‘ri:", refreshError);
        SecureStorage.removeItem("accessToken");
        SecureStorage.removeItem("refreshToken");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
