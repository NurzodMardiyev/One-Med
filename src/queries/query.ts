import axios from "axios";
import SecureStorage from "react-secure-storage";
import api from "../components/api";
import { Dayjs } from "dayjs";
import { EmployeeResponse } from "../components/EmployeeInfo";

const baseApi = "https://api.babyortomed.one-med.uz";

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


type Document = {
  series: string;
  number: string;
  jshr: string;
  issued_by: string;
  issued_date: string;
  expiry_date: string;
};

type DriverLicense = {
  number: string;
  jshr: string;
};

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: string;
  home_phone: string | null;
  gender: "male" | "female";
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  date_of_birth: string; // backend string qaytaradi
  country: string;
  region: string;
  address: string;
  height: number;
  weight: number;
  status: string;
  document_type: "pasport" | "idcard" | "driver_license";
  pasport: Document | null;
  idcard: Document | null;
  driver_license: DriverLicense | null;
  created_at: string;
  updated_at: string;
};
type PatientSelectResponse = {
  success: boolean;
  data: Patient; // bunda date_of_birth, pasport.issued_date ham string edi
};

type PatientResponse = {
  success: boolean;
  message: string;
  data: Patient;
};
type PatientRequest = Omit<
  sendResponseValuesType,
  "date_of_birth" | "pasport" | "idcard"
> & {
  date_of_birth: string;
  pasport?: Omit<Document, "issued_date" | "expiry_date"> & {
    issued_date: string;
    expiry_date: string;
  };
  idcard?: Omit<Document, "issued_date" | "expiry_date"> & {
    issued_date: string;
    expiry_date: string;
  };
  driver_license?: DriverLicense;
};

// Bitta bemorning qisqa ma’lumotlari (search uchun)
type PatientSearchItem = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  gender: "male" | "female"; // faqat shu ikkitasi kelayapti
  status: "active" | "inactive" | string; // agar boshqa statuslar bo‘lishi mumkin bo‘lsa string qoldiramiz
  date_of_birth: string; // YYYY-MM-DD format
  last_visit_date: string | null; // oxirgi tashrif sanasi, null bo‘lishi mumkin
  created_at: string; // ISO datetime
};

// Pagination meta ma’lumotlari
type PaginationMeta = {
  total_pages: number;
  total_items: number;
  current_page: number;
};

// To‘liq search response
type PatientSearchResponse = {
  success: boolean;
  message: string;
  data: PatientSearchItem[];
  meta: PaginationMeta;
};

type visitDoctorType = {
  doctor: string,
  services?: string[]
}

type Service = {
  id: string;
  name: string;
  price: number;
};

type Visit = {
  id: string;
  doctor: string;
  services: Service[];
  total_price: number;
  diagnosis: string | null;
  status: "pending" | "completed" | "cancelled" | string; // agar status doim faqat shu 3 bo'lsa union yozamiz, boshqa bo'lishi mumkin bo'lsa string qoldiramiz
};

type Meta = {
  total_pages: number;
  total_items: number;
  current_page: number;
};

type VisitsResponse = {
  success: boolean;
  message: string;
  data: Visit[];
  meta: Meta;
};

// Doktor kategoriyalari
export type Category = {
  id: string;
  name: string;
  services: Service[];
};

// Doktor statistikasi
export type PatientsStats = {
  total_visits: number;
  total_patients: number;
  total_revenue: number;
  daily_stats: number[];
};

// Doktor modeli
export type Doctor = {
  id: string;
  fio: string;
  username: string;
  phone: string;
  role: "doctor" | "admin" | string;
  status: "active" | "inactive" | string;
  experience_year: number | null;
  more: string | null;
  categories: Category[];
  patients_stats: PatientsStats;
};

// Doktor API response
export type DoctorResponse = {
  success: boolean;
  message: string;
  data: Doctor;
};

export type DataCategoryType = {
  id: string;
  name: string;
  services: ServiceItem[];  // ✅ to‘g‘rilandi
};

export type CategoryName = {
  success: boolean;
  data: DataCategoryType;
};


type CategoryData = {
  id: string;
  name: string;
  services: Service[];
};

type CategoryResponse = {
  success: boolean;
  data: CategoryData;
};

type ServiceRequest = {
  name: string;
  price: number;
};

type CreateCategoryServiceRequest = {
  category: string; // category id
  services: ServiceRequest[];
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

selectPatient: async (select: string): Promise<PatientSelectResponse> => {
  const response = await api.get(`${baseApi}/v1/patients/${select}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
},

updatePatient: async (id: string, obj: PatientRequest): Promise<PatientResponse> => {
  const response = await api.patch(`${baseApi}/v1/patients/${id}`, obj, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
},

getPatientsAll: async (page: number,per_page?: number, search?:string, status?: string, gender?: string): Promise<PatientSearchResponse> => {
    const response = await api.get(`${baseApi}/v1/patients`,  {
      params: {
        page: page  || undefined,
        per_page: per_page || undefined,
        search: search || undefined,
        status: status || undefined,
        gender: gender || undefined
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },


getServicesFromDoctor: async (id: string): Promise<Category[]> => {
  const response = await api.get(`${baseApi}/v1/users/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data.data.doctor.categories;
},

  
  addNewVisit: async (id: string, obj: visitDoctorType): Promise<any> => {
  const response = await api.post(`${baseApi}/v1/patients/${id}/visits`, obj, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
},

patientVisitesData: async (id: string, page?: number, per_page?: number): Promise<VisitsResponse> => {
  const response = await api.get(`${baseApi}/v1/patients/${id}/visits`, {
    params: {
      page: page || undefined,
      per_page: per_page || undefined
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
},

 addCategory: async (obj: {name: string}): Promise<CategoryName> => {
  const response = await api.post(`${baseApi}/v1/service-categories`, obj, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
},

 addServices: async (obj: CreateCategoryServiceRequest): Promise<CategoryResponse> => {
  const response = await api.post(`${baseApi}/v1/services`, obj, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
},

getCategorylist: async (page: number, per_page: number): Promise<any> => {
  const response = await api.get(`${baseApi}/v1/service-categories?page=${page}&per_page=${per_page}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
},

getEmployee: async (id: string): Promise<EmployeeResponse> => {
  const response = await api.get(`${baseApi}/v1/users/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
},

}