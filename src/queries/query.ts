import axios from "axios";
import SecureStorage from "react-secure-storage";

const baseApi = "https://c79325b3ff4a.ngrok-free.app";


export const OneMedAdmin = {
  authLogin: async (obj:{phone: string, password: string}) => {
    const response = await axios.post(`${baseApi}/v1/auth/login`, obj, {
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
  })

  const { access, refresh } = response.data;
    console.log("accessToken", response.data);
    SecureStorage.setItem("accessToken", access);
    SecureStorage.setItem("refreshToken", refresh);
    console.log(response.data);
    return response.status;
}}