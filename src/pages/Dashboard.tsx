import { LuUsers } from "react-icons/lu";
import DashboardCard from "../components/DashboardCard";
import { IoMdTrendingUp } from "react-icons/io";
import { MdOutlineDateRange } from "react-icons/md";
import { Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import DashboardCharts from "../components/DashboardCharts";
import { FaDollarSign } from "react-icons/fa6";
import { VscGraphLine } from "react-icons/vsc";
import { BiUserCheck } from "react-icons/bi";
import { IoReload } from "react-icons/io5";
import { LoadingOutlined } from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "react-query";
import { OneMedAdmin } from "../queries/query";
import "../App.css";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statValueId, setStatValueId] = useState<number | string>(1);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Query orqali Statistikani ovolis umumiy
  const { data: allStatData, isLoading: allStatLoading } = useQuery({
    queryFn: () => OneMedAdmin.allStat(),
    queryKey: ["allStat"],
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  console.log(allStatData);
  const takeStatGraphic = (value: number | string) => {
    setStatValueId(value);
    if (value === 4) {
      console.log(value);
    } else {
      showModal();
      console.log(value);
    }
  };

  const patients = {
    id: 1,
    borderColor: "border-s-[#2B7FFF]",
    color: "#2B7FFF",
    title: "Jami bemorlar",
    howmuch: Number(allStatData?.data?.patients_stats.total_patients),
    icon: (
      <div className="text-[#2B7FFF]">
        <LuUsers />
      </div>
    ),
    iconStat: (
      <div className="text-[#2B7FFF]">
        {" "}
        <IoMdTrendingUp />
      </div>
    ),
    desp: (
      <p className="flex items-center font-[300] gap-2 md:text-[12px] text-[10px] text-[#ababab] mt-[-4px]">
        <LuUsers /> O'tgan oyga nisbatan{" "}
        {allStatData?.data?.patients_stats?.change_from_last_month?.percentage
          ? allStatData?.data?.patients_stats?.change_from_last_month
              ?.percentage + "%"
          : allStatData?.data?.patients_stats?.change_from_last_month?.amount +
            " ta"}
      </p>
    ),
    onClickBtn: takeStatGraphic,
  };

  const accepts = {
    id: 2,
    borderColor: "border-s-[#F9C424]",
    color: "#F9C424",
    title: "Bugungi qabullar",
    howmuch: Number(allStatData?.data?.visits_stats?.total_visits),
    icon: (
      <div className="text-[#F9C424]">
        <MdOutlineDateRange />
      </div>
    ),
    iconStat: (
      <div className="text-[#F9C424]">
        {" "}
        <IoMdTrendingUp />
      </div>
    ),
    desp: (
      <p className="flex items-center font-[300] gap-2 md:text-[12px] text-[10px] text-[#ababab] mt-[-4px]">
        <LuUsers /> {allStatData?.data?.visits_stats?.pending_visits} ta
        kutilayotgan tekshiruv
      </p>
    ),
    onClickBtn: takeStatGraphic,
  };

  const income = {
    id: 3,
    borderColor: "border-s-[#F04242]",
    color: "#F04242",
    title: "Oylik daromad",
    howmuch: Number(allStatData?.data?.visits_stats?.monthly_revenue),
    icon: (
      <div className="text-[##F04242]">
        <FaDollarSign />
      </div>
    ),
    iconStat: (
      <div className="text-[#F04242]">
        <IoMdTrendingUp />
      </div>
    ),
    desp: (
      <p className="flex items-center font-[300] gap-2 md:text-[12px] text-[10px] text-[#ababab] mt-[-4px]">
        <IoMdTrendingUp /> O'tgan oyga nisbatan{" "}
        {allStatData?.data?.visits_stats?.change_from_last_month?.percentage
          ? allStatData?.data?.visits_stats?.change_from_last_month
              ?.percentage + "%"
          : allStatData?.data?.visits_stats?.change_from_last_month?.amount +
            " so'm"}
      </p>
    ),
    onClickBtn: takeStatGraphic,
  };

  const employee = {
    id: 4,
    borderColor: "border-s-[#E9FBF4]",
    color: "#E9FBF4",
    title: "Xodimlar soni",
    howmuch: Number(allStatData?.data?.staff_stats?.total),
    icon: (
      <div className="!text-[##F04242]">
        <VscGraphLine />
      </div>
    ),
    desp: (
      <p className="flex items-center font-[300] gap-2 md:text-[12px] text-[10px] text-[#ababab] mt-[-4px]">
        <LuUsers /> {allStatData?.data?.staff_stats?.doctor_count} shifokor,{" "}
        {allStatData?.data?.staff_stats?.admin_count} admin,{" "}
        {allStatData?.data?.staff_stats?.registrator_count} registrator
      </p>
    ),
    onClickBtn: takeStatGraphic,
  };

  const dataPieChart = [
    {
      name: "Yangi bemorlar",
      value: allStatData?.data?.patients_stats?.new_patients,
    },
    {
      name: "Qaytgan bemorlar",
      value: allStatData?.data?.patients_stats?.returned_patients,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  const [newPatient, setNewPatient] = useState(0);
  const [returnedPatient, setReturnedPatient] = useState(0);
  useEffect(() => {
    if (!allStatData?.data?.patients_stats) return;

    const new_patient_per =
      (allStatData.data.patients_stats.new_patients /
        (allStatData.data.patients_stats.new_patients +
          allStatData.data.patients_stats.returned_patients)) *
      100;

    const returned_patient_per =
      (allStatData.data.patients_stats.returned_patients /
        (allStatData.data.patients_stats.new_patients +
          allStatData.data.patients_stats.returned_patients)) *
      100;

    setNewPatient(new_patient_per);
    setReturnedPatient(returned_patient_per);
  }, [allStatData]);

  if (allStatLoading) {
    return (
      <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center bg-white z-[9999]">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <div className="py-4 pr-[10px] md:pr-auto">
      <div className="px-8 py-6 rounded-md border border-[#c9cfcf] bg-[#E3F2F2]">
        <h1 className="md:text-[24px] text-[18px] font-semibold">
          Tibbiy Klinika Boshqaruviga Xush Kelibsiz
        </h1>
        <p className="text-[#a9a9a9] mt-1 md:text-[16px] text-[12px]">
          Bizning keng qamrovli tibbiy boshqaruv tizimimiz yordamida
          klinikangizni samarali boshqaring.
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-12 gap-3 mt-4">
        <div className="md:col-span-3 col-span-6">
          <DashboardCard obj={patients} />
        </div>
        <div className="md:col-span-3 col-span-6">
          <DashboardCard obj={accepts} />
        </div>
        <div className="md:col-span-3 col-span-6">
          <DashboardCard obj={income} />
        </div>
        <div className="md:col-span-3 col-span-6">
          <DashboardCard obj={employee} />
        </div>
      </div>

      {/* Modals */}
      <Modal
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        className="  block md:!w-[800px]"
      >
        <DashboardCharts chartId={statValueId} />
      </Modal>

      {/* Doctor and patient */}

      <div className="grid grid-cols-12 gap-3 mt-4 h-[500px]">
        <div className="md:col-span-6 col-span-12">
          <div className="border border-[#c8c8c8] rounded-md px-6 py-4">
            <div className="flex justify-between items-center mb-3 md:mb-auto">
              <div>
                <h1 className="md:text-[20px] text-[16px] font-[500] flex items-center gap-2">
                  <VscGraphLine className="text-[#2B7FFF] hidden md:block" />{" "}
                  Har bir shifokor kuniga necha bemor ko'rmoqda
                </h1>
                <p className="md:text-[14px] text-[12px] font-[300] text-[#a2a2a2]">
                  Bugungi kun bo'yicha shifokorlar faoliyati
                </p>
              </div>
              <button className="text-[20px] text-[#2B7FFF] cursor-pointer">
                <IoMdTrendingUp />
              </button>
            </div>
            <div className="overflow-y-scroll h-[410px] scrollbar-hide">
              {allStatData?.data?.doctors_stats.map((item) => (
                <Link
                  to={`/employees/${item.id}`}
                  key={item.id}
                  className="mt-[20px] flex flex-col gap-3"
                >
                  <div className="bg-[#AA5EEF]/10 px-4 py-4 rounded-[10px] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="md:w-[45px] md:h-[45px] w-[35px] h-[35px] rounded-full flex items-center justify-center text-[#AA5EEF] bg-[#AA5EEF]/20 md:text-[26px] text-[20px]">
                        <BiUserCheck />
                      </div>
                      <div>
                        <h3 className="md:text-[16px] text-[13px] font-[500]">
                          {item.fio}
                        </h3>
                        <p className="md:text-[14px] text-[12px] text-[#a2a2a2] font-[300]">
                          Doctor
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="md:text-[24px] mb-[-6px] text-[20px] font-[700]">
                        {item.patient_count}
                      </span>
                      <span className="md:text-[14px] text-[12px] text-[#a2a2a2] font-[300]">
                        bemor
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="md:col-span-6 col-span-12">
          <div className="border border-[#c8c8c8] rounded-md px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="md:text-[20px] text-[16px] font-[500] flex items-center gap-2">
                  <IoReload className="text-[#2B7FFF] hidden md:block" />{" "}
                  Bemorlar Retention Rate
                </h1>
                <p className="md:text-[14px] text-[12px] font-[300] text-[#a2a2a2]">
                  Yangi va qaytgan bemorlar nisbati
                </p>
              </div>
              <button className="text-[20px] text-[#2B7FFF] cursor-pointer">
                <IoMdTrendingUp />
              </button>
            </div>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={dataPieChart}
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    dataKey="value"
                    label={(props) => {
                      const { name, percent = 0 } = props;
                      return `${name} ${(percent * 100).toFixed(0)}%`;
                    }}
                  >
                    {dataPieChart.map((entry, index) => (
                      <Cell
                        key={`cell-${index}-${entry}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-6 gap-3 mt-[20px]">
              <div className="col-span-3 flex flex-col gap-1 py-[10px] rounded-md border border-[#C6DEF5] bg-[#F3F8FD] justify-center items-center">
                <p className="text-[#8F99A3] md:text-[14px] text-[13px] font-[300]">
                  Yangi bemorlar
                </p>
                <span className="md:text-[24px] text-[20px] font-[700] text-[#1173D4]">
                  {allStatData?.data?.patients_stats?.new_patients}
                </span>
                <p className="text-[#8F99A3] md:text-[14px] text-[12px] font-[300]">
                  {newPatient.toFixed(1)}% nisbati
                </p>
              </div>
              <div className="col-span-3 flex flex-col gap-1 py-[10px] rounded-md border border-[#C9F2E1] bg-[#F3FCF8] justify-center items-center">
                <p className="text-[#8F99A3] md:text-[14px] text-[13px] font-[300]">
                  Qaytgan bemorlar
                </p>
                <span className="md:text-[24px] text-[20px] font-[700] text-[#1DC981]">
                  {allStatData?.data?.patients_stats?.returned_patients}
                </span>
                <p className="text-[#8F99A3] md:text-[14px] text-[12px] font-[300]">
                  {returnedPatient.toFixed(1)}% nisbati
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
