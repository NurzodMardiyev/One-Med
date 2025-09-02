import { LuUsers } from "react-icons/lu";
import DashboardCard from "../components/DashboardCard";
import { IoMdTrendingUp } from "react-icons/io";
import { MdOutlineDateRange } from "react-icons/md";
import { Modal } from "antd";
import { useState } from "react";
import DashboardCharts from "../components/DashboardCharts";
import { FaDollarSign } from "react-icons/fa6";
import { VscGraphLine } from "react-icons/vsc";
import { BiUserCheck } from "react-icons/bi";
import { IoReload } from "react-icons/io5";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statValueId, setStatValueId] = useState<number | string>(1);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const takeStatGraphic = (value: number | string) => {
    console.log(value);
    setStatValueId(value);
    showModal();
  };

  const patients = {
    id: 1,
    borderColor: "border-s-[#2B7FFF]",
    color: "#2B7FFF",
    title: "Jami bemorlar",
    howmuch: "1234",
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
      <p className="flex items-center font-[300] gap-2 text-[12px] text-[#ababab] mt-[-4px]">
        <LuUsers /> O'tgan oyga nisbatan +12%
      </p>
    ),
    onClickBtn: takeStatGraphic,
  };

  const accepts = {
    id: 2,
    borderColor: "border-s-[#F9C424]",
    color: "#F9C424",
    title: "Bugungi qabullar",
    howmuch: "24",
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
      <p className="flex items-center font-[300] gap-2 text-[12px] text-[#ababab] mt-[-4px]">
        <LuUsers /> 6 ta kutilayotgan tekshiruv
      </p>
    ),
    onClickBtn: takeStatGraphic,
  };

  const income = {
    id: 3,
    borderColor: "border-s-[#F04242]",
    color: "#F04242",
    title: "Oylik daromad",
    howmuch: "3400000 so'm",
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
      <p className="flex items-center font-[300] gap-2 text-[12px] text-[#ababab] mt-[-4px]">
        <IoMdTrendingUp /> +8% O'tgan oyga nisbatan +12%
      </p>
    ),
    onClickBtn: takeStatGraphic,
  };

  const employee = {
    id: 4,
    borderColor: "border-s-[#E9FBF4]",
    color: "#E9FBF4",
    title: "Xodimlar soni",
    howmuch: "18",
    icon: (
      <div className="!text-[##F04242]">
        <VscGraphLine />
      </div>
    ),
    desp: (
      <p className="flex items-center font-[300] gap-2 text-[12px] text-[#ababab] mt-[-4px]">
        <LuUsers /> 12 shifokor, 6 hamshira
      </p>
    ),
    onClickBtn: takeStatGraphic,
  };

  const dataPieChart = [
    { name: "Yangi bemorlar", value: 400 },
    { name: "Qaytgan bemorlar", value: 300 },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div className="py-4">
      <div className="px-8 py-6 rounded-md border border-[#c9cfcf] bg-[#E3F2F2]">
        <h1 className="text-[24px] font-semibold">
          Tibbiy Klinika Boshqaruviga Xush Kelibsiz
        </h1>
        <p className="text-[#a9a9a9] mt-1">
          Bizning keng qamrovli tibbiy boshqaruv tizimimiz yordamida
          klinikangizni samarali boshqaring.
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-12 gap-3 mt-4">
        <div className="col-span-3">
          <DashboardCard obj={patients} />
        </div>
        <div className="col-span-3">
          <DashboardCard obj={accepts} />
        </div>
        <div className="col-span-3">
          <DashboardCard obj={income} />
        </div>
        <div className="col-span-3">
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
        <div className="col-span-6 border border-[#c8c8c8] rounded-md px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[20px] font-[500] flex items-center gap-2">
                <VscGraphLine className="text-[#2B7FFF]" /> Har bir shifokor
                kuniga necha bemor ko'rmoqda
              </h1>
              <p className="text-[14px] font-[300] text-[#a2a2a2]">
                Bugungi kun bo'yicha shifokorlar faoliyati
              </p>
            </div>
            <button className="text-[20px] text-[#2B7FFF] cursor-pointer">
              <IoMdTrendingUp />
            </button>
          </div>
          <div className="mt-[20px] flex flex-col gap-3">
            <div className="bg-[#AA5EEF]/10 px-4 py-4 rounded-[10px] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-[45px] h-[45px] rounded-full flex items-center justify-center text-[#AA5EEF] bg-[#AA5EEF]/20 text-[26px]">
                  <BiUserCheck />
                </div>
                <div>
                  <h3 className="text-[16px] font-[500]">Dr. Ahmadov Akmal</h3>
                  <p className="text-[14px] text-[#a2a2a2] font-[300]">
                    Kardiolog
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[24px] mb-[-6px] font-[700]">12</span>
                <span className="text-[14px] text-[#a2a2a2] font-[300]">
                  bemor
                </span>
              </div>
            </div>
            <div className="bg-[#AA5EEF]/10 px-4 py-4 rounded-[10px] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-[45px] h-[45px] rounded-full flex items-center justify-center text-[#AA5EEF] bg-[#AA5EEF]/20 text-[26px]">
                  <BiUserCheck />
                </div>
                <div>
                  <h3 className="text-[16px] font-[500]">Dr. Ahmadov Akmal</h3>
                  <p className="text-[14px] text-[#a2a2a2] font-[300]">
                    Kardiolog
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[24px] mb-[-6px] font-[700]">12</span>
                <span className="text-[14px] text-[#a2a2a2] font-[300]">
                  bemor
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-6 border border-[#c8c8c8] rounded-md px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-[20px] font-[500] flex items-center gap-2">
                <IoReload className="text-[#2B7FFF]" /> Bemorlar Retention Rate
              </h1>
              <p className="text-[14px] font-[300] text-[#a2a2a2]">
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
                      key={`cell-${index}`}
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
              <p className="text-[#8F99A3] text-[14px] font-[300]">
                Yangi bemorlar
              </p>
              <span className="text-[24px] font-[700] text-[#1173D4]">256</span>
              <p className="text-[#8F99A3] text-[14px] font-[300]">
                20.7% nisbati
              </p>
            </div>
            <div className="col-span-3 flex flex-col gap-1 py-[10px] rounded-md border border-[#C9F2E1] bg-[#F3FCF8] justify-center items-center">
              <p className="text-[#8F99A3] text-[14px] font-[300]">
                Yangi bemorlar
              </p>
              <span className="text-[24px] font-[700] text-[#1DC981]">256</span>
              <p className="text-[#8F99A3] text-[14px] font-[300]">
                20.7% nisbati
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
