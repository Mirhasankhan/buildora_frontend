"use client";

import AdminHome from "@/components/admin/AdminHome";
import ManagerHome from "@/components/manager/ManagerHome";
import WorkerHome from "@/components/worker/WorkerHome";
import { JWTDecode } from "@/utils/jwt";

const HomePage = () => {
  const { decoded } = JWTDecode();


  return (
    <div>
      {decoded?.role == "ADMIN" && <AdminHome />}{" "}
      {decoded?.role == "SITE_MANAGER" && <ManagerHome />}
      {decoded?.role == "WORKER" && <WorkerHome />}
    </div>
  );
};

export default HomePage;
