// ========================= IMPORTS =========================
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  Empty,
  Modal,
  Segmented,
  Spin,
  Form,
  Select,
  TreeSelect,
  Pagination,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// ===== Icons =====
import { IoMdArrowBack } from "react-icons/io";
import { BiSolidEditAlt } from "react-icons/bi";
import { RiUser3Line } from "react-icons/ri";
import { LuUser, LuHeart } from "react-icons/lu";
import { BsCalendar4, BsTelephone } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { FiPlus } from "react-icons/fi";

import "../App.css";
import { OneMedAdmin } from "../queries/query";

// ========================= TYPES =========================
// Pasport, ID, hujjatlar uchun
type Document = {
  series: string;
  number: string;
  jshr: string;
  issued_by: string;
  issued_date: string;
  expiry_date: string;
};

// Haydovchilik guvohnomasi uchun
type DriverLicense = {
  number: string;
  jshr: string;
};

// Bemor modeli
type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: string;
  home_phone: string | null;
  gender: "male" | "female";
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  date_of_birth: string;
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

// Patientni select qilganda qaytadigan API javobi
type PatientSelectResponse = {
  success: boolean;
  data: Patient;
};

// Servis modeli
type Service = {
  id: string;
  name: string;
  price: number;
};

// Vizit modeli
type Visit = {
  id: string;
  doctor: string;
  services: Service[];
  total_price: number;
  diagnosis: string | null;
  status: "pending" | "completed" | "cancelled" | string;
};

// Pagination meta ma'lumotlari
type Meta = {
  total_pages: number;
  total_items: number;
  current_page: number;
};

// Vizitlarni olish uchun response
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

// ========================= COMPONENT =========================
export default function PatientsInfo() {
  // Segment (Tashriflar / Dorilar) uchun state
  const [segmentValue, setSegmentValue] = useState(true);

  // Modal (yangi tashrif qo‘shish)
  const [isVisitOpen, setIsVisitOpen] = useState(false);

  // Shifokor tanlaganda ID ni ushlab turadigan state
  const [handleSelectDoctorState, setHandleSelectDoctorState] = useState("");

  // URL'dan bemor ID sini olish
  const { id } = useParams<{ id: string }>();

  // Modal ochish-yopish handlerlari
  const showModal = () => {
    setIsVisitOpen(true);
  };
  const handleOk = () => {
    setIsVisitOpen(false);
  };
  const handleCancel = () => setIsVisitOpen(false);

  // ========================= QUERIES =========================
  // 1. Bemor ma’lumotlari
  const {
    data: patientData,
    isLoading,
    error,
  } = useQuery<PatientSelectResponse, Error>({
    queryKey: ["patient", id],
    queryFn: () => OneMedAdmin.selectPatient(id!),
    staleTime: Infinity, // data abadiy fresh
    cacheTime: Infinity,
  });

  // 2. Bemor tashriflari
  const [visitesPage, setvisitespage] = useState(1);
  const { data: patientVisitesData, refetch: visitsFetch } = useQuery<
    VisitsResponse,
    Error
  >({
    queryKey: ["patientVisitesData", id, visitesPage, 10],
    queryFn: () => OneMedAdmin.patientVisitesData(id!, visitesPage, 10),
    staleTime: Infinity, // data abadiy fresh
    cacheTime: Infinity,
    enabled: !!id,
  });

  console.log(patientVisitesData);

  // 3. Xodimlar (shifokorlar) ro‘yxati
  const { data: employeesData } = useQuery({
    queryKey: ["employees", 1, 20, "", "doctor"],
    queryFn: () => OneMedAdmin.getEmployeesFilter(1, 20, "", "doctor"),
    keepPreviousData: true,
    enabled: isVisitOpen, // faqat modal ochilganda chaqiriladi
  });

  // Select uchun shifokor options
  const employeeOptions =
    employeesData?.data?.map((item: any) => ({
      value: item.id,
      label: item.fio,
    })) || [];

  // 4. Doktordan xizmatlar olish
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["services", handleSelectDoctorState],
    queryFn: () => OneMedAdmin.getServicesFromDoctor(handleSelectDoctorState),
    enabled: !!handleSelectDoctorState,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  // ========================= MUTATION =========================
  const queryClient = useQueryClient();
  const { mutate: addEmployeMutate, isLoading: addEmpLoading } = useMutation<
    any,
    Error,
    { doctor: string; services: string[] }
  >((obj) => OneMedAdmin.addNewVisit(id!, obj), {
    onSuccess: () => {
      queryClient.invalidateQueries(["patient", id]); // bemorni qayta chaqirish
      visitsFetch();
      setIsVisitOpen(false); // modal yopish
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Form submit (yangi tashrif)
  const handleNewVisit = (value: { doctor: string; services: string[] }) => {
    if (!id) return;
    addEmployeMutate(value);
  };

  // Doktor tanlash
  const handleSelectDoctor = (value: string) => {
    setHandleSelectDoctorState(value);
  };

  // ========================= DERIVED DATA =========================
  // Yoshni hisoblash
  const age =
    new Date().getFullYear() -
    Number(patientData?.data.date_of_birth.slice(0, 4));

  // Ism familiya bosh harflari (avatar uchun)
  const logo1 = patientData?.data.first_name.slice(0, 1);
  const logo2 = patientData?.data.last_name.slice(0, 1);

  // Gender
  const gender = patientData?.data.gender === "male" ? "Erkak" : "Ayol";

  // TreeSelect uchun service daraxti

  const treeData2 = categories
    ? categories.map((category: Category) => ({
        value: category.id,
        title: category.name,
        selectable: false,
        children: category.services.map((srv: Service) => ({
          value: srv.id,
          title: srv.name,
        })),
      }))
    : [];

  // ========================= LOADING / ERROR =========================
  if (isLoading) {
    return (
      <div className="absolute left-0 top-0 z-[9999] w-full h-screen flex justify-center items-center bg-white/20 backdrop:blur-2xl">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute left-0 top-0 z-[9999] w-full h-screen flex justify-center items-center bg-white/20 backdrop:blur-2xl">
        <Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" />
      </div>
    );
  }

  // ========================= RENDER =========================
  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between my-4">
        {/* Orqaga qaytish */}
        <div className="flex items-center gap-4">
          <Link
            to="/patients"
            className="flex items-center gap-1 px-6 py-2.5 text-[14px] font-[500] rounded-md hover:bg-[#E6F4FF]"
          >
            <IoMdArrowBack className="text-[16px]" />
            Orqaga
          </Link>

          {/* Patient ismi + avatar */}
          <div className="flex items-center gap-3">
            <div className="flex uppercase justify-center items-center w-[60px] h-[60px] font-[600] text-[18px] rounded-full bg-[#DBEAFE] text-[#2B7FFF]">
              {logo1}
              {logo2}
            </div>
            <div>
              <h2 className="text-[22px] font-[600] mb-[-5px]">
                {patientData?.data.first_name} {patientData?.data.last_name}
              </h2>
              <p className="text-[#9D99AB] font-[300] text-[14px]">
                {age} yosh, {gender}
              </p>
            </div>
          </div>
        </div>

        {/* Edit tugmasi */}
        <div>
          <button className="cursor-pointer px-6 py-2.5 bg-[#4d94ff] text-[#fff] rounded-md text-[14px] flex gap-2 hover:bg-[#2B7FFF] transition-all duration-150">
            <BiSolidEditAlt className="text-[18px]" />
            Tahrirlash
          </button>
        </div>
      </div>

      {/* MA’LUMOT BLOKLARI */}
      <div className="grid grid-cols-12 gap-4 mb-3">
        {/* LEFT: Asosiy ma'lumotlar */}
        <div className="col-span-4 flex flex-col gap-3">
          <div className="border bg-[#fff] border-[#E8E8E8] p-[25px] rounded-[10px]">
            <div className="flex items-center gap-2">
              <RiUser3Line className="text-[#2B7FFF] text-[22px]" />
              <h3 className="text-[20px] font-[500]">Asosiy ma'lumotlar</h3>
            </div>

            {/* Avatar */}
            <div className="flex justify-center flex-col text-center mt-[20px]">
              <div className="mx-auto uppercase w-[80px] h-[80px] mb-2 flex items-center justify-center rounded-full bg-[#DBEAFE] font-[600] text-[18px] text-[#2B7FFF]">
                {logo1}
                {logo2}
              </div>
              <h4 className="font-[500]">
                {patientData?.data.first_name} {patientData?.data.last_name}
              </h4>
              <p className="text-[#b6b6b6]">{age} yosh</p>
            </div>

            {/* Qo‘shimcha info */}
            <div className="flex flex-col gap-3 mt-[40px]">
              <div className="flex items-center gap-4">
                <BsCalendar4 />
                <p>{patientData?.data.date_of_birth}</p>
              </div>
              <div className="flex items-center gap-4">
                <LuUser />
                <p>{gender}</p>
              </div>
              <div className="flex items-center gap-4">
                <LuHeart />
                <p>{patientData?.data.blood_group}</p>
              </div>
              <div className="flex items-center gap-4">
                <BsTelephone />
                <p>{patientData?.data.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Tibbiy tarix */}
        <div className="col-span-8">
          <div className="border bg-[#fff] border-[#E8E8E8] p-[25px] rounded-[10px]">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <GrDocumentText className="text-[22px]" />
              <h3 className="text-[20px] font-[500]">Tibbiy tarix</h3>
            </div>

            {/* Tabs */}
            <Segmented
              onChange={() => setSegmentValue(!segmentValue)}
              options={["Tashriflar", "Dorilar"]}
              className="!p-1 seg"
              block
            />

            {/* Tashriflar bo‘limi */}
            <div>
              {/* Header */}
              <div className="flex justify-between items-center my-4">
                <h3 className="font-[500]">Tashriflar tarixi</h3>
                <button
                  onClick={showModal}
                  className="flex items-center text-white bg-[#4D94FF] text-[14px] px-4 py-2.5 gap-2 rounded-md cursor-pointer"
                >
                  <FiPlus className="text-[17px]" /> Yangi tashrif qo'shish
                </button>
              </div>

              {/* Modal */}
              <Modal
                title="Yangi tashrif qo'shish."
                open={isVisitOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={false}
              >
                <Form
                  onFinish={handleNewVisit}
                  className="p-4"
                  layout="vertical"
                >
                  {/* Doctor select */}
                  <Form.Item name="doctor" label="Shifokor">
                    <Select
                      className="w-full"
                      onChange={handleSelectDoctor}
                      options={employeeOptions}
                    />
                  </Form.Item>

                  {/* Services tree */}
                  {handleSelectDoctorState && (
                    <Form.Item name="services" label="Servislar">
                      <TreeSelect
                        showSearch
                        style={{ width: "100%" }}
                        multiple
                        placeholder="Please select"
                        allowClear
                        treeCheckable
                        treeDefaultExpandAll
                        showCheckedStrategy={TreeSelect.SHOW_CHILD}
                        treeData={treeData2}
                      />
                    </Form.Item>
                  )}

                  {/* Submit */}
                  <div>
                    <button className="bg-[#4D94FF] text-white w-full py-2.5 rounded-md hover:bg-[#2B7FFF] transition-all">
                      {addEmpLoading ? (
                        <Spin
                          className="!text-white"
                          indicator={<LoadingOutlined spin />}
                        />
                      ) : (
                        "Saqlash"
                      )}
                    </button>
                  </div>
                </Form>
              </Modal>

              {/* Tashriflar ro‘yxati */}
              {segmentValue ? (
                !patientVisitesData?.data?.length ? (
                  <Empty />
                ) : (
                  patientVisitesData?.data.map((item) => (
                    <div
                      key={item.id}
                      className="border border-[#c9c9c9] rounded-[10px] border-l-[4px] border-l-[#4D94FF] px-6 py-4 mb-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-[17px] font-[500]">
                          {item.doctor}
                        </h4>
                        <span className="text-[14px] text-[#676767]">
                          2024-12-15
                        </span>
                      </div>

                      <ul className="mt-3 flex flex-col gap-1">
                        <li className="flex items-center text-[14px] gap-2 text-[#676767]">
                          <span className="font-[400] text-[#000]">
                            Status:
                          </span>
                          <div
                            className={`${
                              item.status === "pending"
                                ? "bg-[#afc4d9]"
                                : item.status === "active"
                                ? "bg-[#CDF4E4]"
                                : "bg-[#c47d7d]"
                            } px-3 py-0.5 text-white rounded-[4px]`}
                          >
                            {item.status}
                          </div>
                        </li>
                        <li className="flex items-center text-[14px] gap-2 text-[#676767]">
                          <span className="font-[400] text-[#000]">
                            Davolash:
                          </span>
                          {item.services?.map((r) => r.name).join(", ")}
                        </li>
                        <li className="flex items-center text-[14px] gap-2 text-[#676767]">
                          <span className="font-[400] text-[#000]">
                            To'lov:
                          </span>
                          {item.services?.map((r) => r.price).join(", ")} so'm
                        </li>
                      </ul>
                    </div>
                  ))
                )
              ) : (
                // Agar "Dorilar" segmenti tanlansa
                <div className="border border-[#c9c9c9] rounded-[10px] border-l-[4px] border-l-[#A855F7] px-6 py-4 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[17px] font-[500]">Metformin 500mg</h4>
                    <span className="text-[14px] text-[#676767]">
                      2024-12-15
                    </span>
                  </div>
                  <p className="text-[14px] text-[#676767] mt-[-3px]">
                    Kuniga 2 marta
                  </p>
                </div>
              )}

              {/* Pagination */}
              {segmentValue &&
                patientVisitesData?.meta?.total_items &&
                patientVisitesData.meta.total_items > 10 && (
                  <div className="px-6 py-4 border bg-[#F9FAFB] border-[#E0E6EB] flex items-center justify-end rounded-[10px]">
                    <Pagination
                      current={visitesPage}
                      pageSize={10}
                      onChange={(p) => setvisitespage(p)}
                      total={patientVisitesData.meta.total_items}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
