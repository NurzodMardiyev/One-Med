import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useCreateContext } from "../context/ContextApi";
import Container from "../components/Container";
import NavBar from "../components/NavBar";

export default function Layout() {
  const { collapsed } = useCreateContext();
  console.log(collapsed);
  return (
    <div className="">
      <div className="lg:max-w-[2560px] md:max-w-[1600px]  mx-auto flex bg-[#F9FAFB]">
        {/* <Container className="mx-auto flex"> */}
        <div className="z-10 hidden md:block fixed  ">
          <Sidebar />
        </div>
        <div
          className={`${
            collapsed ? "ms-[100px]" : "ms-[320px]"
          } transition-all duration-150 ms-[0px] w-full lg:max-w-[2260px] md:max-w-[1300px] md:me-[20px]   flex-1`}
        >
          {/* Navabar */}
          <NavBar />
          <Outlet />
        </div>
        {/* </Container> */}
      </div>
    </div>
  );
}
