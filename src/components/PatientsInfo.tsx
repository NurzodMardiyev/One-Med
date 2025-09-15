import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { RiUser3Line } from "react-icons/ri";
import { LuUser } from "react-icons/lu";
import { BsCalendar4 } from "react-icons/bs";
import { LuHeart } from "react-icons/lu";
import { BsTelephone } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import {
  Empty,
  Modal,
  Segmented,
  Spin,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import "../App.css";
import { useQuery } from "react-query";
import { OneMedAdmin } from "../queries/query";
import { LoadingOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

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
export default function PatientsInfo() {
  const [segmentValue, setSegmentValue] = useState(true);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const { id } = useParams<{ id: string }>();

  const showModal = () => {
    setIsVisitOpen(true);
  };

  const handleOk = () => {
    setIsVisitOpen(false);
  };

  const handleCancel = () => {
    setIsVisitOpen(false);
  };

  const {
    data: patientData,
    isLoading,
    error,
  } = useQuery<PatientSelectResponse, Error>({
    queryKey: ["patient", id],
    queryFn: () => OneMedAdmin.selectPatient(id!),
    enabled: !!id, // id bo‘lsa ishlaydi
  });

  // shifokorlar ro'yhatini olish
  const page = 1,
    per_page = 20,
    role = "doctor",
    search = "";
  const { data: employeesData } = useQuery({
    queryKey: ["employees", page, per_page, search, role],
    queryFn: () => OneMedAdmin.getEmployeesFilter(page, per_page, search, role),
    keepPreviousData: true,
  });

  const employeeOptions =
    employeesData?.data?.map((item: any) => ({
      value: item.id, // formga value sifatida ID ketadi
      label: item.fio, // ekranda esa FIO ko‘rinadi
    })) || [];

  const age =
    new Date().getFullYear() -
    Number(patientData?.data.date_of_birth.slice(0, 4));

  const logo1 = patientData?.data.first_name.slice(0, 1);
  const logo2 = patientData?.data.last_name.slice(0, 1);

  const gender = patientData?.data.gender === "male" ? "Erkak" : "Ayol";

  const handleNewVisit = () => {};

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
  return (
    // Patient Info page
    <div>
      {/* Header */}
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-4">
          <Link
            to="/patients"
            className="flex items-center gap-1 px-6 py-2.5 text-[14px] font-[500] rounded-md hover:bg-[#E6F4FF] "
          >
            <IoMdArrowBack className="text-[16px]" />
            Orqaga
          </Link>

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
                {age} yosh, patientDetail.{gender}
              </p>
            </div>
          </div>
        </div>
        <div>
          <button className="cursor-pointer px-6 py-2.5 bg-[#4d94ff] text-[#fff] rounded-md text-[14px] flex gap-2 hover:bg-[#2B7FFF] transform transition-all duration-150">
            <BiSolidEditAlt className="text-[18px] " />
            Tahrirlash
          </button>
        </div>
      </div>

      {/* Malumotlar */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 flex flex-col gap-3 ">
          <div className="border border-[#E8E8E8] p-[25px] rounded-[10px]">
            <div className="flex items-center gap-2 ">
              <RiUser3Line className="text-[#2B7FFF] text-[22px]" />
              <h3 className="text-[20px] font-[500]">Asosiy ma'lumotlar</h3>
            </div>
            <div className="flex justify-center flex-col text-center mt-[20px]">
              <div className="mx-auto uppercase w-[80px] h-[80px] mb-2 flex items-center justify-center rounded-full bg-[#DBEAFE] font-[600] text-[18px] text-[#2B7FFF]">
                {logo1}
                {logo2}
              </div>
              <h4 className="font-[500] ">
                {" "}
                {patientData?.data.first_name} {patientData?.data.last_name}
              </h4>
              <p className="text-[#b6b6b6] ">{age} yosh</p>
            </div>

            <div className="flex flex-col gap-3 mt-[40px]">
              <div className="flex items-center gap-4">
                <BsCalendar4 className="text-[16px]" />
                <p className="text-[#363636] text-[14px] font-[400]">
                  {patientData?.data.date_of_birth}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <LuUser className="text-[16px]" />
                <p className="text-[#363636] text-[14px] font-[400]">
                  patientDetail.{gender}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <LuHeart className="text-[16px]" />
                <p className="text-[#363636] text-[14px] font-[400]">
                  {patientData?.data.blood_group}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <BsTelephone className="text-[16px]" />
                <p className="text-[#363636] text-[14px] font-[400]">
                  {patientData?.data.phone}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-[#e8e8e8] p-[25px] rounded-[10px]">
            <h4 className="font-[500] mb-2">Allergiya</h4>
            <div className="flex gap-3 items-center">
              <button className="px-2 bg-red-500 font-[400] text-[14px] text-white rounded-2xl">
                Plitsilin
              </button>
              <button className="px-2 bg-red-500 font-[400] text-[14px] text-white rounded-2xl">
                Yong'oq
              </button>
            </div>
          </div>

          <div className="border border-[#E8E8E8] p-[25px] rounded-[10px]">
            <h4 className="font-[500] mb-2">Surunkali kasalliklar</h4>
            <div className="flex gap-3 items-center">
              <button className="px-2 border border-[#e2e2e2] font-[400] text-[14px]  rounded-2xl">
                Plitsilin
              </button>
              <button className="px-2 border border-[#e2e2e2] font-[400] text-[14px]  rounded-2xl">
                Yong'oq
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-8 ">
          {/* header */}
          <div className="border border-[#E8E8E8] p-[25px] rounded-[10px]">
            <div className="flex items-center gap-2 mb-3">
              <GrDocumentText className=" text-[22px]" />
              <h3 className="text-[20px] font-[500]">Tibbiy tarix</h3>
            </div>

            {/* Tashriflar Dorilar btn */}
            <Segmented
              onChange={() => setSegmentValue(!segmentValue)}
              options={["Tashriflar", "Dorilar"]}
              className="!p-1 seg"
              block
            />
            {/* Tashriflar */}
            <div>
              <div className="flex justify-between items-center my-4">
                <h3 className="font-[500]">Tashriflar tarixi</h3>
                <button
                  onClick={showModal}
                  className="flex items-center text-white bg-[#4D94FF] text-[14px] px-4 py-2.5 gap-2 rounded-md cursor-pointer"
                >
                  <FiPlus className="text-[17px]" /> Yangi tashrif qo'shish
                </button>
              </div>

              {/* Yangi tashrif qo'shish */}
              <Modal
                title="Yangi tashrif qo'shish."
                closable={{ "aria-label": "Custom Close Button" }}
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
                  <Form.Item label="Sana">
                    <DatePicker className="w-full " />
                  </Form.Item>
                  <Form.Item label="Tashrif sababi">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Shifokor">
                    <Select className="w-full " options={employeeOptions} />
                  </Form.Item>
                  <Form.Item label="Tashxis">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Davolash">
                    <TextArea />
                  </Form.Item>
                  <Form.Item label="To'lov moqdori">
                    <Input />
                  </Form.Item>

                  <div>
                    <button className="bg-[#4D94FF] text-white w-full py-2.5 rounded-md hover:bg-[#2B7FFF] transition-all duration-150 transform">
                      Saqlash
                    </button>
                  </div>
                </Form>
              </Modal>

              {/* tashrif qismi */}
              {segmentValue ? (
                <div className="border border-[#c9c9c9] rounded-[10px] border-l-[4px] border-l-[#4D94FF] px-6 py-4 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[17px] font-[500]">Muntazam ko'rik</h4>
                    <span className="text-[14px] font-[300] gap-2 text-[#676767]">
                      2024-12-15
                    </span>
                  </div>
                  <p className="text-[14px] font-[300] gap-2 text-[#676767] mt-[-3px]">
                    Dr. Hasan Tilovov
                  </p>

                  <ul className="mt-3 flex flex-col gap-1">
                    <li className="flex items-center text-[14px] font-[300] gap-2 text-[#676767]">
                      <span className="font-[400] text-[#000]">Tashxis: </span>{" "}
                      Qandli diabet
                    </li>
                    <li className="flex items-center text-[14px] font-[300] gap-2 text-[#676767]">
                      <span className="font-[400] text-[#000]">Davolash: </span>{" "}
                      Dori terapiyasi
                    </li>
                    <li className="flex items-center text-[14px] font-[300] gap-2 text-[#676767]">
                      <span className="font-[400] text-[#000]">To'lov: </span>{" "}
                      200,000 so'm
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="border border-[#c9c9c9] rounded-[10px] border-l-[4px] border-l-[#A855F7] px-6 py-4 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[17px] font-[500]">Metformin 500mg</h4>
                    <span className="text-[14px] font-[300] gap-2 text-[#676767]">
                      2024-12-15
                    </span>
                  </div>
                  <p className="text-[14px] font-[300] gap-2 text-[#676767] mt-[-3px]">
                    Kuniga 2 marta
                  </p>

                  <ul className="mt-3 flex flex-col gap-1">
                    <li className="flex items-center text-[14px] font-[300] gap-2 text-[#676767]">
                      <span className="font-[400] text-[#000]">
                        patientDetail.durationPrefix:{" "}
                      </span>{" "}
                      3 oy
                    </li>
                    <li className="flex items-center text-[14px] font-[300] gap-2 text-[#676767]">
                      <span className="font-[400] text-[#000]">
                        patientDetail.instructionPrefix:{" "}
                      </span>{" "}
                      Ovqatdan keyin qabul qiling
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
