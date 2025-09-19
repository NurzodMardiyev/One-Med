import { BiSolidEditAlt } from "react-icons/bi";
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
// import { IoTrashOutline } from "react-icons/io5";
import { FaStethoscope } from "react-icons/fa6";
import { PiMedalLight } from "react-icons/pi";
import { LuUser } from "react-icons/lu";
import { BsTelephone } from "react-icons/bs";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { OneMedAdmin, UpdateEmployeePayload } from "../queries/query";
import {
  Button,
  Input,
  Modal,
  Form,
  Spin,
  TreeSelect,
  TreeSelectProps,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  services: Service[];
}

export interface DailyStat {
  date: string; // "YYYY-MM-DD"
  visit_count: number;
  patient_count: number;
  revenue: number;
}

export interface PatientsStats {
  total_visits: number;
  total_patients: number;
  total_revenue: number;
  daily_stats: DailyStat[];
}

export interface DoctorInfo {
  categories: Category[];
  experience_year: number | null;
  patients_stats: PatientsStats;
}

export interface EmployeeData {
  id: string;
  fio: string;
  username: string;
  role: "doctor" | "nurse" | "admin" | string; // agar faqat doctor bo‘lsa -> "doctor"
  phone: string;
  doctor: DoctorInfo;
  status: "active" | "inactive" | string;
  more: any; // backenddan nima kelishini bilmagan payt
}

export interface EmployeeResponse {
  success: boolean;
  data: EmployeeData;
}

type NotificationType = "success" | "info" | "warning" | "error";

export default function EmployeeInfo() {
  // URL'dan bemor ID sini olish
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const [enable, setEnable] = useState(false);
  const [serPage, setSerPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [treeData2, setTreeData2] = useState<any[]>([]);
  const [treeSelectValues, setTreeSelectValues] = useState<string[]>([]);

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Xatolik yuz berdi",
      description:
        "Siz kategoriya tanlagan bo'lishingiz mumkin, Servis tanlang! .",
    });
  };

  // 1. xodim ma’lumotlari
  const { data: employeeData } = useQuery<EmployeeResponse, Error>({
    queryKey: ["employee", id],
    queryFn: () => OneMedAdmin.getEmployee(id!),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const chartData =
    employeeData?.data?.doctor?.patients_stats?.daily_stats.map((stat) => ({
      date: stat.date, // X o‘qi uchun date qoldiramiz
      patients: stat.patient_count, // Bemorlari
    })) || [];

  const chartData2 =
    employeeData?.data?.doctor?.patients_stats?.daily_stats.map((stat) => ({
      date: stat.date,
      revenue: stat.revenue, // pul
    })) || [];

  const formatNumber = (value: number) => {
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + " mln"; // 2.6 mln
    }
    if (value >= 1_000) {
      return (value / 1_000).toFixed(0) + " ming"; // 20 ming
    }
    return value.toString(); // kichkina sonlar oddiy
  };

  // console.log(employeeData?.data);

  const serviceIds = Array.from(
    new Set(
      employeeData?.data?.doctor?.categories.flatMap((c) =>
        c.services.map((s) => s.id)
      )
    )
  );
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    setEnable(true);
    setTreeSelectValues(serviceIds);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const queryClient = useQueryClient();
  const { mutate: updateEmployeeMutate, isLoading: updateEmployeeLoading } =
    useMutation<
      EmployeeData,
      Error,
      { id: string; data: UpdateEmployeePayload }
    >(({ id, data }) => OneMedAdmin.updateEmployee(id, data), {
      onSuccess: () => {
        queryClient.invalidateQueries(["employee", id]);
        setIsModalOpen(false);
      },
      onError: (err) => {
        console.error("Update employee error:", err);
        openNotificationWithIcon("error");
      },
    });

  useEffect(() => {
    if (employeeData?.data) {
      // const data: EmployeeProfile = employeeData.data;

      form.setFieldsValue({
        fio: employeeData.data.fio,
        username: employeeData.data.username,
        phone: employeeData.data.phone,
        role: employeeData.data.role,
        more: employeeData.data.more,
        doctor: employeeData.data.doctor
          ? {
              experience_year: employeeData.data.doctor.experience_year,
              services: employeeData.data.doctor.categories.flatMap((c) =>
                c.services.map((s) => s.id)
              ), // faqat id lar
            }
          : undefined,
      });
    }
  }, [employeeData, form]);

  // Servislarni olish

  const { data: servicesData, isFetching } = useQuery({
    queryKey: ["services", serPage], // <-- serPage qo‘shildi
    queryFn: () => OneMedAdmin.getServices(serPage, 10),
    enabled: enable,
    keepPreviousData: true, // eski data yo‘qolmasin
  });

  const handlePopupScroll: TreeSelectProps["onPopupScroll"] = (e) => {
    const target = e.target as HTMLDivElement;

    if (
      hasMore &&
      !isFetching &&
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 5
    ) {
      setSerPage((prev) => prev + 1);
    }
  };

  // console.log(newServiceData);

  useEffect(() => {
    if (servicesData?.data?.length) {
      setTreeData2((prev) => [
        ...prev,
        ...servicesData.data.map((category) => ({
          key: `cat-${category.id}`, // unique key
          value: category.id,
          title: category.name,
          selectable: false,
          children: category.services.map((srv) => ({
            key: `srv-${srv.id}`, // unique key
            value: srv.id,
            title: srv.name,
          })),
        })),
      ]);

      if (servicesData.data.length < 10) {
        setHasMore(false); // end of list
      }
    }
  }, [servicesData]);

  // const takeServicesFromBack = () => setEnable(true);

  return (
    <div>
      <div className="flex items-center justify-between my-4">
        {/* Orqaga qaytish */}
        {contextHolder}
        <div className="flex items-center gap-4">
          <Link
            to="/employees"
            className="flex items-center gap-1 px-6 py-2.5 text-[14px] font-[500] rounded-md hover:bg-[#E6F4FF]"
          >
            <IoMdArrowBack className="text-[16px]" />
            Orqaga
          </Link>

          {/* Patient ismi + avatar */}
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-[22px] font-[600] mb-[-5px]">
                Doctor ma'lumotlari
              </h2>
              <p className="text-[#9D99AB] font-[300] text-[14px]">
                To'liq ma'lumot va jadval
              </p>
            </div>
          </div>
        </div>

        {/* Edit tugmasi */}
        <div className="flex gap-3">
          <button
            onClick={showModal}
            className="cursor-pointer text-blue-500 border-blue-500 px-6 py-2 border  rounded-md text-[14px] flex gap-2 hover:bg-[#E6F4FF] transition-all duration-150"
          >
            <BiSolidEditAlt className="text-[18px]" />
            Tahrirlash
          </button>

          {/* <button className="cursor-pointer px-6 py-2 border border-red-500 text-red-500 rounded-md text-[14px] flex gap-2 hover:bg-red-500/10 transition-all duration-150">
            <IoTrashOutline className="text-[18px]" />
            O'chirish
          </button> */}
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="Basic Modal"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            const payload = {
              fio: values.fio,
              username: values.username,
              phone: values.phone,
              role: values.role,
              more: values.more,
              doctor: values.doctor
                ? {
                    experience_year: values.doctor.experience_year,
                    services: treeSelectValues, // backendga faqat id yuboriladi
                  }
                : undefined,
            };

            console.log(payload);

            updateEmployeeMutate({ id: id!, data: payload });
            //updateProfileMutate(payload); // mutationni chaqiramiz
          }}
        >
          <Form.Item label="FIO" name="fio">
            <Input />
          </Form.Item>

          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Input />
          </Form.Item>

          <Form.Item label="More" name="more">
            <Input />
          </Form.Item>

          {employeeData?.data?.doctor && (
            <>
              <Form.Item
                label="Experience Year"
                name={["doctor", "experience_year"]}
              >
                <Input type="number" />
              </Form.Item>

              <Form.Item label="Services" name={["doctor", "services"]}>
                <TreeSelect
                  // onClick={takeServicesFromBack}
                  showSearch
                  style={{ width: "100%" }}
                  multiple
                  placeholder="Please select"
                  allowClear
                  treeCheckable
                  onPopupScroll={handlePopupScroll}
                  treeDefaultExpandAll
                  showCheckedStrategy={TreeSelect.SHOW_CHILD}
                  onChange={(v) => {
                    setTreeSelectValues(v), console.log(v);
                  }}
                  treeData={treeData2}
                  popupRender={(menu) => (
                    <div className="">
                      {menu}
                      {isFetching && hasMore && (
                        <div style={{ textAlign: "center", padding: 8 }}>
                          <Spin
                            indicator={<LoadingOutlined spin />}
                            size="small"
                          />
                        </div>
                      )}
                    </div>
                  )}
                />
              </Form.Item>
            </>
          )}

          <div>
            <Button
              type="primary"
              htmlType="submit"
              className="flex !w-full !h-[38px]"
            >
              {updateEmployeeLoading ? (
                <Spin
                  className="!text-white"
                  indicator={<LoadingOutlined spin />}
                />
              ) : (
                "Saqlash"
              )}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Body qism */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <div className="border bg-[#fff] border-[#E8E8E8]  rounded-[10px]">
            <div className="bg-[#1173D4] rounded-t-[10px] px-[20px] py-[25px]">
              <h4 className="text-[20px] font-[600] text-white">
                {employeeData?.data.fio}
              </h4>
              <p className="text-[20px] font-[500] text-white/40">
                ID: {employeeData?.data.username}
              </p>
              <span className="inline-flex items-center mt-2 text-white px-[10px] py-[4px] gap-1 rounded-xl bg-[#418FDD]">
                {" "}
                <FaStethoscope /> roles.{employeeData?.data.role}
              </span>
              <div className="text-white mt-2">
                <span className="flex items-center gap-1">
                  <PiMedalLight /> tajriba
                </span>
              </div>
            </div>
            <div className="px-[20px] py-[25px]">
              <div className="flex items-start gap-2  border-b border-b-[#d9d9d9] pb-6 mb-6">
                <div className="p-2 rounded-md text-[#0079f3] bg-[#bed2e7]">
                  <LuUser />
                </div>
                <div>
                  <h5 className="font-[600] text-[18px] mt-1">Mutahasislik</h5>
                  <div className="flex flex-col gap-2.5 mt-4">
                    <div>
                      <span className="uppercase text-[#8FA9C7]">BOLIM</span>
                      {employeeData?.data?.doctor?.categories?.map((item) => (
                        <div key={item.id}>
                          <p className="font-[600]">{item.name}</p>

                          <span className="uppercase mt-2 inline-block text-[#8FA9C7]">
                            Servis
                          </span>

                          {item.services?.map((i) => (
                            <p key={i.id} className="font-[600]">
                              {i.name}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2  ">
                <div className="p-2 rounded-md text-[#010306] bg-[#d6d8db]">
                  <BsTelephone />
                </div>
                <div className="w-full">
                  <h5 className="font-[600] text-[18px] mt-1">Bog'lanish</h5>
                  <div className="border border-[#d4d4d4] rounded-xl flex items-center py-3 px-4 !w-full bg-[#EFFBF6] gap-4 mt-4">
                    <BsTelephone className="text-[17px]" />
                    <div className="">
                      <span className="uppercase text-[#8FA9C7]">Telefon</span>
                      <p className="font-[600]">{employeeData?.data.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-8">
          <div className="border bg-[#fff] border-[#E8E8E8] p-[25px] rounded-[10px] mb-4">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorPatients"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4a90e2" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4a90e2" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="date"
                  tickFormatter={(date: string) => {
                    const parts = date.split("-");
                    return `${parts[2]}/${parts[1]}`; // 15/07
                  }}
                />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />

                {/* Tooltipni custom qildik */}
                <Tooltip
                  formatter={(value) => [`Qabul: ${value} bemor`, ""]}
                  labelFormatter={(label) => {
                    // label "2025-07-15" bo'lsa → ["2025","07","15"]
                    const parts = label.split("-");
                    return `${parts[2]}/${parts[1]}`; // "15/07"
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#4a90e2"
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="border bg-[#fff] border-[#E8E8E8] p-[25px] rounded-[10px]">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={chartData2}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="date"
                  tickFormatter={(date: string) => {
                    const parts = date.split("-");
                    return `${parts[2]}/${parts[1]}`; // faqat kun/oy
                  }}
                />
                <YAxis tickFormatter={(value) => formatNumber(value)} />
                <CartesianGrid strokeDasharray="3 3" />

                <Tooltip
                  formatter={(value) => [`${value} so'm`, "Daromad"]}
                  labelFormatter={(label) => {
                    const parts = label.split("-");
                    return `${parts[2]}/${parts[1]}`; // 15/07
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4CAF50"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
