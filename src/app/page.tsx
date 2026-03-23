"use client";

import AdminHome from "@/components/admin/AdminHome";
import ManagerHome from "@/components/manager/ManagerHome";
import { JWTDecode } from "@/utils/jwt";

const HomePage = () => {
  const { decoded } = JWTDecode();

  return (
    <div>
      {decoded?.role == "ADMIN" && <AdminHome />}{" "}
      {decoded?.role == "SITE_MANAGER" && <ManagerHome />}
    </div>
  );
};

export default HomePage;
