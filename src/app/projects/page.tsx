"use client";

import Container from "@/utils/Container";
import AdminProjects from "@/components/admin/AdminProjects";
import { JWTDecode } from "@/utils/jwt";
import ManagerProjects from "@/components/manager/ManagerProjects";

const ProjectsPage = () => {
  const { decoded } = JWTDecode();
  return (
    <Container>
      {decoded?.role == "ADMIN" && <AdminProjects />}
      {decoded?.role == "SITE_MANAGER" && <ManagerProjects />}
    </Container>
  );
};

export default ProjectsPage;
