import axios from "axios";
import SecureStorage from "react-secure-storage";
import api from "../components/api";

const baseApi = "https://7796cabd7d3c.ngrok-free.app";


export const OneMedAdmin = {
  authLogin: async (obj:{phone: string, password: string}) => {
    const response = await axios.post(`${baseApi}/v1/auth/login`, obj, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
  })

  const { access_token, refresh_token } = response.data.data;
    console.log("accessToken", response.data.data.access_token);
    SecureStorage.setItem("accessToken", access_token);
    SecureStorage.setItem("refreshToken", refresh_token);
    console.log(response.data);
    return response.data;

  },

  addEmployee: async (obj: {fio: string, username: string, password: string, role: string, phone: string}) => {
    const response = await api.post(`${baseApi}/v1/users`, obj, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  }
}