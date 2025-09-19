import { Form, Pagination, Spin } from "antd";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { BsTelephone } from "react-icons/bs";
import { PiCalendarDotsLight } from "react-icons/pi";
import { useQuery } from "react-query";
import { OneMedAdmin } from "../queries/query";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";

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

export default function Patients() {
  const [page, setPage] = useState(1);
  const per_page = 10;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const handleTakeSearchValue = (value: { search: string }) => {
    console.log(value);
    setSearch(value.search);
  };

  console.log(status);

  const { data: getPatientsAll, isLoading: patientLoading } =
    useQuery<PatientSearchResponse>({
      queryKey: ["patients", page, per_page, search, status],
      queryFn: () => OneMedAdmin.getPatientsAll(page, per_page, search, status),
      staleTime: Infinity,
      cacheTime: Infinity,
      keepPreviousData: true,
    });

  if (patientLoading) {
    return (
      <div className="absolute left-0 top-0 z-[9999] w-full h-screen flex justify-center items-center bg-white/20 backdrop:blur-2xl">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Search section */}
      <div className="px-6 py-6 border border-[#E0E6EB] rounded-[10px] flex items-center gap-3 mt-4">
        <Form onFinish={handleTakeSearchValue} className="flex-1">
          <Form.Item name="search" className="!m-0 relative">
            <div>
              <IoSearch className="inline-block absolute left-[10px] top-[35%] text-[#717171]" />
              <input
                type="text"
                className="w-full border border-[#eaeaea] m-0 pr-3 py-2 ps-[35px] rounded-[6px] focus:outline-[#2D80FF] bg-[#F9FAFB] text-[14px] md:h-[41px]"
                placeholder="Ism, bo'lim yoki ID bo'yicha qidirish..."
              />
            </div>
          </Form.Item>
        </Form>
        <div className="flex items-center gap-2">
          {/* <button
            onClick={() => setStatus("")}
            className={`px-3 py-2 border border-[#eaeaea] rounded-[6px] ${
              status === "" ? "bg-[#2D80FF] text-white" : "text-black"
            } cursor-pointer text-[14px] md:h-[41px] flex items-center justify-center`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setStatus("active")}
            className={`px-3 py-2 border border-[#eaeaea] rounded-[6px]  ${
              status === "active" ? "bg-[#2D80FF] text-white" : "text-black"
            }  cursor-pointer text-[14px] md:h-[41px] flex items-center justify-center`}
          >
            Faol
          </button>
          <button
            onClick={() => setStatus("nonactive")}
            className={`px-3 py-2 border border-[#eaeaea] rounded-[6px] ${
              status === "nonactive" ? "bg-[#2D80FF] text-white" : "text-black"
            } cursor-pointer text-[14px] md:h-[41px] flex items-center justify-center`}
          >
            Nofaol
          </button> */}
          <div className="flex items-center gap-2">
            {["", "active", "nonactive"].map((r) => (
              <button
                key={r}
                onClick={() => setStatus(r)}
                className={`px-3 py-2 border border-[#eaeaea] rounded-[6px] ${
                  status === r ? "bg-[#2D80FF] text-white" : "text-black"
                } cursor-pointer text-[14px] md:h-[41px]`}
              >
                {r === ""
                  ? "Barchasi"
                  : r === "active"
                  ? "Faol"
                  : r === "nonactive"
                  ? "Nofaol"
                  : ""}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patients' info */}
      <div className="mt-[14px]">
        {getPatientsAll?.data.map((item) => {
          const age =
            new Date().getFullYear() - Number(item.date_of_birth.slice(0, 4));

          const gender = item.gender === "male" ? "Erkak" : "Ayol";
          return (
            <Link
              key={item.id}
              to={`${item.id}`}
              className="px-6 py-4 mb-3 border border-[#E0E6EB] flex items-center justify-between rounded-[10px] bg-[#fff]"
            >
              <div className="flex items-center gap-3">
                <div className="w-[50px] h-[50px] flex justify-center items-center rounded-full bg-[#E7F0FA] text-[#2A81D8] text-[24px]">
                  <LuUser />
                </div>
                <div>
                  <h3 className="text-[18px] font-[600]">
                    {item.first_name} {item.last_name}
                  </h3>
                  <p className="text-[14px] text-[#8b8b8b] flex gap-2">
                    {age} yosh, bemor {gender} <BsTelephone /> {item.phone}
                    <span className="ml-2">
                      So'ngi tashrif: {item.last_visit_date}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-2.5 py-1 rounded-full text-[#5AA6F2] bg-[#EEF6FD] flex items-center text-[14px] gap-1.5">
                  <PiCalendarDotsLight className="text-[16px]" />
                  <span>{item.last_visit_date}</span>
                </button>
                <button className="text-[14px] text-white bg-[#1DC981] px-2.5 py-1 rounded-full">
                  {item.status}
                </button>
              </div>
            </Link>
          );
        })}
        {/* Pagination */}
        {getPatientsAll
          ? getPatientsAll?.meta?.total_items > 10 && (
              <div className="px-6 py-4 border border-[#E0E6EB] flex items-center justify-end rounded-[10px] bg-[#fff] mb-5">
                <Pagination
                  current={page}
                  pageSize={10}
                  onChange={(p) => setPage(p)}
                  total={getPatientsAll?.meta.total_items}
                />
              </div>
            )
          : ""}
      </div>
    </div>
  );
}
