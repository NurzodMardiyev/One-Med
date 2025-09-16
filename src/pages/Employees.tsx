import { FiPlus } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import {
  Form,
  Input,
  Modal,
  notification,
  Pagination,
  Select,
  Spin,
  TreeSelect,
} from "antd";
import { Link } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { BsTelephone } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { OneMedAdmin } from "../queries/query";
import { LoadingOutlined } from "@ant-design/icons";
import "../App.css";

type EmployeeResponseType = {
  id: string;
  fio: string;
  username: string;
  role: string;
  phone: string;
  status: string;
  services?: string[];
};
type EmployeeObjType = {
  fio: string;
  username: string;
  password: string;
  role: string;
  phone: string;
  services?: string[];
};

type Service = {
  id: string;
  name: string;
  price: number;
};

type ServiceCategory = {
  id: string;
  name: string;
  services: Service[];
};
export default function Employees() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const per_page = 10;

  // natification

  type NotificationType = "success" | "info" | "warning" | "error";

  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string
  ) => {
    api[type]({
      message: "Notification Title",
      description: message,
    });
  };

  // Xodimlar olish
  const { data: employeesData, isLoading } = useQuery({
    queryKey: ["employees", page, per_page, search, role],
    queryFn: () => OneMedAdmin.getEmployeesFilter(page, per_page, search, role),
    keepPreviousData: true,
  });

  // Servislarni olish
  const [enable, setEnable] = useState(false);
  const { data: servicesData } = useQuery({
    queryKey: ["services"],
    queryFn: () => OneMedAdmin.getServices(1, 10),
    enabled: enable,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const treeData2 = servicesData?.data.map((category: ServiceCategory) => ({
    value: category.id,
    title: category.name,
    selectable: false,
    children: category.services.map((srv) => ({
      value: srv.id,
      title: <div>{srv.name}</div>,
    })),
  }));

  const takeServicesFromBack = () => setEnable(true);

  // Xodim qo‘shish
  const queryClient = useQueryClient();
  const { mutate: addEmployeMutate, isLoading: addEmpLoading } = useMutation<
    EmployeeResponseType,
    Error,
    EmployeeObjType
  >((obj) => OneMedAdmin.addEmployee(obj), {
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]); // faqat shu query refresh bo‘ladi
      setIsModalOpen(false);
    },
    onError: (error) => {
      openNotificationWithIcon("error", error.message);
    },
  });

  const addEmployeeFunc = (value: EmployeeObjType) => {
    addEmployeMutate(value);
  };

  const [showService, setShowServices] = useState(false);
  const handleRoleChange = (value: string) => {
    setShowServices(value === "doctor");
  };

  if (isLoading) {
    return (
      <div className="absolute left-0 top-0 z-[9999] w-full h-screen flex justify-center items-center bg-white/20 backdrop:blur-2xl">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }
  return (
    <div>
      {contextHolder}
      {/* Header */}
      <div className="flex items-center justify-between mt-[30px]">
        <div>
          <h1 className="text-[22px] font-[600]">Xodimlar boshqaruvi</h1>
          <p className="text-[#8F99A3]">
            Klinika xodimlari va ularning jadvallarini boshqarish
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex gap-2 items-center py-2 px-4 rounded-md text-white cursor-pointer bg-[#2B7FFF]"
        >
          <FiPlus className="text-[20px]" />
          Xodim qo'shish
        </button>
      </div>

      {/* Search + filter */}
      <div className="px-6 py-6 border border-[#E0E6EB] rounded-[10px] flex items-center gap-3 mt-4">
        <Form
          onFinish={(values) => setSearch(values.search)}
          className="flex-1"
        >
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
          {["", "admin", "doctor", "registrator"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-2 border border-[#eaeaea] rounded-[6px] ${
                role === r ? "bg-[#2D80FF] text-white" : "text-black"
              } cursor-pointer text-[14px] md:h-[41px]`}
            >
              {r === ""
                ? "Barchasi"
                : r === "doctor"
                ? "Shifokorlar"
                : r === "registrator"
                ? "Xodimlar"
                : "Adminlar"}
            </button>
          ))}
        </div>
      </div>

      {/* Employees list */}
      <div className="mt-[14px]">
        {employeesData?.data?.map(
          (item: { id: string; fio: string; phone: string; role: string }) => (
            <Link
              key={item.id}
              to={`${item.id}`}
              className="px-6 py-4 border border-[#E0E6EB] flex items-center justify-between rounded-[10px] bg-[#fff] mb-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-[50px] h-[50px] flex justify-center items-center rounded-full bg-[#E7F0FA] text-[#2A81D8] text-[24px]">
                  <LuUser />
                </div>
                <div>
                  <h3 className="text-[18px] font-[600]">{item.fio}</h3>
                  <p className="text-[14px] text-[#8b8b8b] flex gap-2">
                    <BsTelephone /> {item.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-2.5 py-1 rounded-full text-[#5AA6F2] bg-[#EEF6FD] flex items-center text-[14px] gap-1.5">
                  <FaUserDoctor /> {item.role}
                </button>
              </div>
            </Link>
          )
        )}

        {/* Pagination */}
        {employeesData?.meta?.total_items > 10 && (
          <div className="px-6 py-4 border border-[#E0E6EB] flex items-center justify-end rounded-[10px] bg-[#fff] mb-5">
            <Pagination
              current={page}
              pageSize={10}
              onChange={(p) => setPage(p)}
              total={employeesData?.meta.total_items}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        title="Xodim qo'shish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
        {addEmpLoading ? (
          <div className="w-full h-[500px] flex justify-center items-center">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        ) : (
          <Form onFinish={addEmployeeFunc} layout="vertical">
            <Form.Item name="fio" label="Familiya Ism Sharif">
              <Input />
            </Form.Item>
            <Form.Item name="username" label="Username">
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input />
            </Form.Item>
            <Form.Item name="role" label="Role">
              <Select
                onChange={handleRoleChange}
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "doctor", label: "Shifokor" },
                  { value: "registrator", label: "Registrator" },
                ]}
              />
            </Form.Item>

            {showService && (
              <Form.Item name={["doctor", "services"]} label="Servislar">
                <TreeSelect
                  onClick={takeServicesFromBack}
                  showSearch
                  style={{ width: "100%" }}
                  multiple
                  placeholder="Please select"
                  allowClear
                  treeCheckable
                  treeDefaultExpandAll
                  showCheckedStrategy={TreeSelect.SHOW_CHILD}
                  onChange={(v) => console.log(v)}
                  treeData={treeData2}
                />
              </Form.Item>
            )}

            <Form.Item name="phone" label="Tel raqam">
              <Input />
            </Form.Item>
            <div className="flex justify-end gap-3">
              <button className="cursor-pointer px-6 py-2 bg-[#2A81D8] border border-[#2A81D8] rounded-md text-white">
                Saqlash
              </button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}
