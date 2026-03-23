"use client";

import AdminProjectDetails from "@/components/admin/AdminProjectDetails";
import ManagerProjectDetails from "@/components/manager/ManagerProjectDetails";
import { JWTDecode } from "@/utils/jwt";

const ProjectPage = () => {
  const { decoded } = JWTDecode();
  return (
    <div>
      {decoded?.role === "ADMIN" && <AdminProjectDetails></AdminProjectDetails>}
      {decoded?.role === "SITE_MANAGER" && (
        <ManagerProjectDetails></ManagerProjectDetails>
      )}
    </div>
  );
};

export default ProjectPage;
