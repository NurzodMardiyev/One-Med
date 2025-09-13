import axios from "axios";
import SecureStorage from "react-secure-storage";
import api from "../components/api";
import { Dayjs } from "dayjs";

const baseApi = "https://onemed-backend.onrender.com";

type ServiceItem = {
  id: string;
  name: string;
  price: number;
};
 type Services = {
    id: string,
    name: string,
    services: ServiceItem[]
  }


  type pasport = {
    series: string;
    number: string;
    jshr: string;
    issued_by: string;
    issued_date: Dayjs;
    expiry_date: Dayjs;
  };
  type driver = {
    number: string;
    jshr: string;
  };
  type sendResponseValuesType = {
    first_name: string;
    middle_name: string;
    last_name: string;
    phone: string;
    document_type: string;
    pasport?: pasport;
    idcard?: pasport;
    driver_license?: driver;
    gender: string;
    date_of_birth: Dayjs;
    blood_group: string;
    country: string;
    height: number;
    weight: number;
  };

  type PatientResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    phone: string;
    document_type: string;
    gender: string;
    date_of_birth: string; // backend string qaytaradi
    blood_group: string;
    country: string;
    region: string;
    address: string;
    height: number;
    weight: number;
    status: string;
    pasport: {
      series: string;
      number: string;
      jshr: string;
      issued_by: string;
      issued_date: string;
      expiry_date: string;
    } | null;
    idcard: any; // agar keladigan structure aniq bo‘lsa yozib beramiz
    driver_license: any;
    home_phone: string | null;
    created_at: string;
    updated_at: string;
  };
};
type PatientRequest = Omit<
  sendResponseValuesType,
  "date_of_birth" | "pasport"
> & {
  date_of_birth: string;
  pasport?: Omit<pasport, "issued_date" | "expiry_date"> & {
    issued_date: string;
    expiry_date: string;
  };
};
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
  },

  getEmployees: async () => {
    const response = await api.get(`${baseApi}/v1/users`,  {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },

  getEmployeesFilter: async (page: number,per_page?: number, search?:string, role?: string) => {
    const response = await api.get(`${baseApi}/v1/users`,  {
      params: {
        page: page  || undefined,
        per_page: per_page || undefined,
        search: search || undefined,
        role: role || undefined
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },
 

  getServices: async (page: number, pageSize: number): Promise<{data: Services[]}> => {
    const response = await api.get(`${baseApi}/v1/service-categories?page=${page}&per_page=${pageSize}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },

  addPatient: async (obj: PatientRequest): Promise<PatientResponse> => {
  const response = await api.post(`${baseApi}/v1/patients`, obj, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
},

searchPatient: async (search: string): Promise<any> => {
  const response = await api.get(`${baseApi}/v1/patients`, {
    params: {
      search
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
},

}