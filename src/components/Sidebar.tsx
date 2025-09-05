import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { IoHomeOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { LuUserPlus } from "react-icons/lu";
import { TbReportMedical } from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useCreateContext } from "../context/ContextApi";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMedrt } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import "../App.css";

type MenuItem = Required<MenuProps>["items"][number];

export default function Sidebar() {
  const { collapsed, setCollapsed } = useCreateContext();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items: MenuItem[] = [
    { key: "dashboard", icon: <IoHomeOutline />, label: "Bosh sahifa" },
    { key: "patients", icon: <LuUsers />, label: "Bemorlar" },
    { key: "signIn", icon: <LuUserPlus />, label: "Royhatdan o'tish" },
    { key: "employees", icon: <TbReportMedical />, label: "Xodimlar" },
    { key: "settings", icon: <IoSettingsOutline />, label: "Sozlamalar " },
  ];

  const handleEvent = (e: { key: string }) => {
    navigate(e.key, { replace: true });
  };

  const handleEventLogOut = (e: { key: string }) => {
    navigate(e.key, { replace: true });
  };
  return (
    <div className="min-h-screen w-[300px] flex flex-col">
      <div className="mb-4">
        <Menu
          onClick={handleEvent}
          inlineCollapsed={collapsed}
          mode="inline"
          items={[
            {
              key: "/",
              icon: <FaMedrt className="!text-[26px] !text-blue-500 " />,
              label: (
                <p className="font-bold text-[24px] text-blue-500">One Med</p>
              ),
            },
          ]}
          className="logo !border-none"
        />
      </div>
      <Menu
        onClick={handleEvent}
        defaultSelectedKeys={[location.pathname.slice(1)]}
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
        className="!border-none"
      />
      <Menu
        onClick={handleEventLogOut}
        mode="inline"
        inlineCollapsed={collapsed}
        items={[{ key: "/", icon: <FiLogOut />, label: "Chiqish" }]}
        className="!border-none"
      />
      <div className="!mt-auto">
        <Menu
          onClick={toggleCollapsed}
          inlineCollapsed={collapsed}
          mode="inline"
          items={[
            {
              key: "1",
              icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
              label: "Sidebar",
            },
          ]}
          className=" !border-none !mb-4 sidebarBtn"
        />
      </div>
    </div>
  );
}
