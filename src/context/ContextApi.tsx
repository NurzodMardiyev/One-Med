import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "react-query";
import { UserProfileResponse } from "../pages/Settings";
import { OneMedAdmin } from "../queries/query";
import SecureStorage from "react-secure-storage";
interface Data {
  fio: string;
  phone: string;
  username: string;
}

interface CreateContProviderInterface {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;

  userFio: string;
  setUserFio: React.Dispatch<React.SetStateAction<string>>;

  userData: Data;
  setUserData: React.Dispatch<React.SetStateAction<Data>>;

  getUserProfileData?: UserProfileResponse;
}

export const CreateContProvider = createContext<
  CreateContProviderInterface | undefined
>(undefined);

export function useCreateContext() {
  const context = useContext(CreateContProvider);
  if (!context) {
    throw new Error("useCreateContext must be used within ContextApiProvider");
  }
  return context;
}

export default function ContextApiProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [userFio, setUserFio] = useState("");
  const [userData, setUserData] = useState<Data>({
    fio: "",
    phone: "",
    username: "",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true); // md dan kichik bo‘lsa
      } else {
        setCollapsed(false); // md dan katta bo‘lsa
      }
    };

    // birinchi renderda ham tekshiradi
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const accessToken = SecureStorage.getItem("accessToken");

  // Queru orqali user profile malumotlarini olish
  const { data: getUserProfileData } = useQuery<UserProfileResponse>({
    queryKey: ["getUserProfile"], // category emas, user profile
    queryFn: () => OneMedAdmin.getUserProfile(),
    staleTime: Infinity,
    enabled: !!accessToken,
    cacheTime: Infinity,
  });

  return (
    <CreateContProvider.Provider
      value={{
        collapsed,
        setCollapsed,
        userFio,
        setUserFio,
        userData,
        setUserData,
        getUserProfileData,
      }}
    >
      {children}
    </CreateContProvider.Provider>
  );
}
