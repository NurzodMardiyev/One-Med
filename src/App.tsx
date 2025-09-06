import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Employees from "./pages/Employees";
import RegisterLayout from "./layout/RegisterLayout";
import DoctorLayout from "./layout/DoctorLayout";
import TokenRefresher from "./components/tokenRefresh";

function App() {
  return (
    <div className="">
      <TokenRefresher />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/employees" element={<Employees />} />
        </Route>

        <Route path="register" element={<RegisterLayout />}></Route>
        <Route path="doctor" element={<DoctorLayout />}></Route>
      </Routes>
    </div>
  );
}

export default App;
