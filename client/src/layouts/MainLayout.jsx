import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";

const MainLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} />

      <div
        style={{
          marginLeft: "260px",
          minHeight: "100vh",
          background: "#f5f6fa",
        }}
      >
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main
          style={{
            padding: "20px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;

