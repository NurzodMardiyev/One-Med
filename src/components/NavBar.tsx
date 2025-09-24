// import { Select } from "antd";
// import { MdOutlineTranslate } from "react-icons/md";

import { FaRegUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useCreateContext } from "../context/ContextApi";
import { useEffect, useState } from "react";

export default function NavBar() {
  const location = useLocation();
  const { getUserProfileData } = useCreateContext();
  // const handleChange = (value: string) => {
  //   console.log(`selected ${value}`);
  // };

  const [fio, setFio] = useState("");

  useEffect(() => {
    const FIO =
      getUserProfileData?.data?.fio !== ""
        ? getUserProfileData?.data?.fio
        : localStorage.getItem("fio");
    if (FIO) {
      setFio(FIO);
    }
  }, [getUserProfileData]);

  const currentPath = location.pathname.split("/")[1] || "Admin paneli";

  return (
    <div className="  flex items-center justify-between w-full py-2 border-b border-[#e8e8e8] bg-white/20 backdrop:blur-md pr-[10px] md:pr-auto">
      <h2 className="md:text-[18px] text-[14px] font-semibold">
        {currentPath === "doctor"
          ? "Shifokor paneli"
          : currentPath === "register"
          ? "Registratsiya paneli"
          : "Admin paneli"}
      </h2>

      <div className="flex items-center gap-3">
        {/* <div className="flex items-center gap-2">
          <MdOutlineTranslate className="text-[#676767]" />
          <Select
            style={{ width: 120 }}
            onChange={handleChange}
            defaultValue={"uzb"}
            options={[
              { value: "uzb", label: "O'zbekcha" },
              { value: "rus", label: "Ruscha" },
              { value: "eng", label: "Inglizcha" },
            ]}
          />
        </div> */}

        <div className="flex items-center gap-2">
          <FaRegUser className="text-[#676767] md:text-[16px] text-[12px]" />
          <p>
            {currentPath === "doctor"
              ? "Shifokor"
              : currentPath === "register"
              ? "Registrator"
              : "Admin"}{" "}
            ({fio})
          </p>
        </div>
      </div>
    </div>
  );
}
