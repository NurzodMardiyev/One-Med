import { useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { IoHomeOutline } from "react-icons/io5";
import { LuUsers, LuUserPlus } from "react-icons/lu";
import { TbReportMedical } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useCreateContext } from "../context/ContextApi";
import logo from "../../public/images/logo.png";

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
    <div
      className={`min-h-screen ${
        collapsed ? "w-[80px]" : "w-[300px]"
      }  flex flex-col`}
    >
      {/* Logo */}
      <div className="">
        <Menu
          onClick={() => navigate("/")}
          inlineCollapsed={collapsed}
          mode="inline"
          items={[
            {
              key: "logo",
              icon: (
                <div>
                  <img src={logo} alt="" className="w-[35px]" />
                </div>
              ),
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
        className="!border-none flex-1 !pt-4"
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
      <div className="!mt-auto !mb-0">
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
          className="!border-none !pb-4 sidebarBtn"
        />
      </div>
    </div>
  );
}
