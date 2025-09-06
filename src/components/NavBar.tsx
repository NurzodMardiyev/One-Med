import { Select } from "antd";
import { MdOutlineTranslate } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div className="  flex items-center justify-between w-full py-2 border-b border-[#e8e8e8] bg-white/20 backdrop:blur-md">
      <h2 className="text-[18px] font-semibold">
        {location.pathname === "/doctor"
          ? "Bemorlar ro'yhati"
          : location.pathname === "/register"
          ? "Ro'yhatga olish"
          : "Bosh Sahifa"}
      </h2>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
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
        </div>

        <div className="flex items-center gap-2">
          <FaRegUser className="text-[#676767]" />
          <p>Shifokor (Nurzod)</p>
        </div>
      </div>
    </div>
  );
}
