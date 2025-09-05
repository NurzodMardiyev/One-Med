import { FiPlus } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { Form, Input, Modal, Select } from "antd";
import { Link } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import { BsTelephone } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { useState } from "react";

export default function Employees() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleTakeSearchValue = (value: string) => {
    console.log(value);
  };

  const addEmployeeFunc = (value: {}) => {
    console.log(value);
  };

  const handleRoleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  return (
    <div>
      <div className="flex items-center justify-between mt-[30px]">
        <div>
          <h1 className="text-[22px] font-[600]">Xodimlar boshqaruvi</h1>
          <p className="text-[#8F99A3]">
            Klinika xodimlari va ularning jadvallarini boshqarish
          </p>
        </div>
        <div>
          <button
            onClick={() => showModal()}
            className="flex gap-2 items-center py-2 px-4 rounded-md text-white cursor-pointer bg-[#2B7FFF]"
          >
            <FiPlus className="text-[20px]" />
            Xodim qo'shish
          </button>
        </div>
      </div>

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
            Shifokor
          </button>
          <button className="px-3 py-2 border border-[#eaeaea] rounded-[6px]  text-black cursor-pointer text-[14px] md:h-[41px] flex items-center justify-center">
            Xodimlar
          </button>
        </div>
      </div>

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
              <FaUserDoctor /> Doctor
            </button>
          </div>
        </Link>
      </div>

      {/* Xodim qo'shish */}
      <Modal
        title="Xodim qo'shish"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
      >
        <Form onFinish={addEmployeeFunc} layout="vertical">
          <Form.Item name="fio" label="Familiya Ism Sharif">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="username" label="Username">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input type="text" />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select
              defaultValue="doctor"
              onChange={handleRoleChange}
              options={[
                { value: "doctor", label: "Shifokor" },
                { value: "register", label: "Registrator" },
              ]}
            />
          </Form.Item>
          <Form.Item name="phone" label="Tel raqam">
            <Input type="text" />
          </Form.Item>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleCancel}
              type="button"
              className="cursor-pointer px-4 py-2 border border-[#2A81D8] text-[#2A81D8] rounded-md"
            >
              Bekor qilish
            </button>
            <button className="cursor-pointer px-4 py-2 bg-[#2A81D8] border border-[#2A81D8] rounded-md text-white">
              Saqlash
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
