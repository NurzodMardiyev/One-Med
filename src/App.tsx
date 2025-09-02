import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="" element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
