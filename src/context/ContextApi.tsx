import { createContext, ReactNode, useContext, useState } from "react";
interface CreateContProviderInterface {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
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

  return (
    <CreateContProvider.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </CreateContProvider.Provider>
  );
}
