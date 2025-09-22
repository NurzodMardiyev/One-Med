import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { IoHomeOutline } from "react-icons/io5";
import { LuUsers, LuUserPlus } from "react-icons/lu";
import { TbReportMedical } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { FaMedrt } from "react-icons/fa";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useCreateContext } from "../context/ContextApi";

type MenuItem = Required<Parameters<typeof Menu>[0]>["items"][number];

export default function Sidebar() {
  const { collapsed, setCollapsed } = useCreateContext();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split("/")[1] || "dashboard";

  const toggleCollapsed = () => setCollapsed(!collapsed);

  const items: MenuItem[] = [
    { key: "dashboard", icon: <IoHomeOutline />, label: "Bosh sahifa" },
    { key: "patients", icon: <LuUsers />, label: "Bemorlar" },
    { key: "registration", icon: <LuUserPlus />, label: "Royhatdan o'tish" },
    { key: "employees", icon: <TbReportMedical />, label: "Xodimlar" },
    { key: "settings", icon: <IoSettingsOutline />, label: "Sozlamalar " },
  ];

  const handleEvent = (e: { key: string }) => {
    navigate(`/${e.key}`, { replace: true });
  };

  return (
    <div className="min-h-screen w-[300px] flex flex-col ">
      {/* Logo */}
      <div className="pb-4">
        <Menu
          onClick={() => navigate("/")}
          inlineCollapsed={collapsed}
          mode="inline"
          items={[
            {
              key: "logo",
              icon: <FaMedrt className="!text-[26px] !text-blue-500 " />,
              label: (
                <p className="font-bold text-[24px] text-blue-500">One Med</p>
              ),
            },
          ]}
          className="logo !border-none"
        />
      </div>

      {/* Asosiy menu */}
      <Menu
        onClick={handleEvent}
        selectedKeys={[currentPath]}
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
        className="!border-none"
      />

      {/* Logout */}
      <Menu
        onClick={() => navigate("/")}
        mode="inline"
        inlineCollapsed={collapsed}
        items={[{ key: "logout", icon: <FiLogOut />, label: "Chiqish" }]}
        className="!border-none"
      />

      {/* Collapse button */}
      <div className="!mt-auto">
        <Menu
          onClick={toggleCollapsed}
          inlineCollapsed={collapsed}
          mode="inline"
          items={[
            {
              key: "toggle",
              icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
              label: "Sidebar",
            },
          ]}
          className="!border-none !mb-4 sidebarBtn"
        />
      </div>
    </div>
  );
}
