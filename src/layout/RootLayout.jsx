import { Button } from "primereact/button";
import { TabMenu } from "primereact/tabmenu";
import React, { useEffect } from "react";
import { Outlet, useNavigate, useRouteError } from "react-router-dom";

const RootLayout = () => {
  const navigate = useNavigate();

  const checkToken = () => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("token_expiry");

      if (!token || !expiry || new Date().getTime() > parseInt(expiry)) {
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        navigate("/login");
      }
  }

  useEffect(() => {
    checkToken()
  }, [])

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    navigate("/login");
  }

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: () => {
        navigate("/");
      },
    },
    {
      label: "Campaign",
      icon: "pi pi-megaphone",
      command: () => {
        navigate("/campaign");
      },
    },
  ];
  return (
    <div className="w-full h-screen flex flex-col">
      <div className="px-8">
        <div className="flex items-center justify-between pt-7 pb-3">
          <div className="font-semibold text-3xl">DP Jewellers Dashboard</div>
          <Button onClick={handleLogOut}>Logout</Button>
        </div>
        <TabMenu model={items} />
      </div>

      <div className="overflow-auto px-8 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
