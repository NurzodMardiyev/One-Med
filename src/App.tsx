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
import PriviteRote from "./queries/PriviteRote";
import Registration from "./pages/Registration";

function App() {
  return (
    <div className="">
      <TokenRefresher />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="" element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <PriviteRote>
                <Dashboard />
              </PriviteRote>
            }
          />
          <Route
            path="/patients"
            element={
              <PriviteRote>
                <Patients />
              </PriviteRote>
            }
          />
          <Route
            path="/employees"
            element={
              <PriviteRote>
                <Employees />
              </PriviteRote>
            }
          />
          <Route
            path="/registration"
            element={
              <PriviteRote>
                <Registration />
              </PriviteRote>
            }
          />
        </Route>

        <Route
          path="register"
          element={
            <PriviteRote>
              <RegisterLayout />
            </PriviteRote>
          }
        ></Route>
        <Route
          path="doctor"
          element={
            <PriviteRote>
              <DoctorLayout />
            </PriviteRote>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
