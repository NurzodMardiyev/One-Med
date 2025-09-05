import { Form } from "antd";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { BsTelephone } from "react-icons/bs";
import { PiCalendarDotsLight } from "react-icons/pi";

export default function Patients() {
  const handleTakeSearchValue = (value: string) => {
    console.log(value);
  };
  return (
    <div>
      {/* Search section */}
      <div className="px-6 py-6 border border-[#E0E6EB] rounded-[10px] flex items-center gap-3 mt-4">
        <Form onFinish={handleTakeSearchValue} className="flex-1">
          <Form.Item name="search" className="!m-0 relative">
            <IoSearch className="inline-block absolute left-[10px] top-[35%] text-[#717171]" />
            <input
              type="text"
              className="w-full border border-[#eaeaea] m-0 pr-3 py-2 ps-[35px] rounded-[6px] focus:outline-[#2D80FF] bg-[#F9FAFB] text-[14px] md:h-[41px]"
              placeholder="Ism, bo'lim yoki ID bo'yicha qidirish..."
            />
          </Form.Item>
        </Form>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 border border-[#eaeaea] rounded-[6px] bg-[#2D80FF] text-white cursor-pointer text-[14px] md:h-[41px] flex items-center justify-center">
            Barchasi
          </button>
          <button className="px-3 py-2 border border-[#eaeaea] rounded-[6px]  text-black cursor-pointer text-[14px] md:h-[41px] flex items-center justify-center">
            Faol
          </button>
          <button className="px-3 py-2 border border-[#eaeaea] rounded-[6px]  text-black cursor-pointer text-[14px] md:h-[41px] flex items-center justify-center">
            Nofaol
          </button>
        </div>
      </div>

      {/* Patients' info */}
      <div className="mt-[14px]">
        <Link
          to="patients/info"
          className="px-6 py-4 border border-[#E0E6EB] flex items-center justify-between rounded-[10px] bg-[#fff]"
        >
          <div className="flex items-center gap-3">
            <div className="w-[50px] h-[50px] flex justify-center items-center rounded-full bg-[#E7F0FA] text-[#2A81D8] text-[24px]">
              <LuUser />
            </div>
            <div>
              <h3 className="text-[18px] font-[600]">Abbos Ramazonov</h3>
              <p className="text-[14px] text-[#8b8b8b] flex gap-2">
                45 yosh patients.erkak <BsTelephone /> +998 88 3921383 So'ngi
                tashrif: 2024-12-2
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-2.5 py-1 rounded-full text-[#5AA6F2] bg-[#EEF6FD] flex items-center text-[14px] gap-1.5">
              <PiCalendarDotsLight className="text-[16px]" />
              <span>2024-01-25</span>
            </button>
            <button className="text-[14px] text-white bg-[#1DC981] px-2.5 py-1 rounded-full">
              Faol
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
