import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

import "../styles/layout.css";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="main-content">

      <Sidebar
        isOpen={sidebarOpen}
      />

      <div className="layout-content">

        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default MainLayout;