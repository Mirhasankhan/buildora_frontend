import Container from "@/utils/Container";
import React from "react";
import InviteMemberModal from "./InviteMemberModal";

const AdminHome = () => {
  return (
    <Container>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium mb-2">Overview</h1>
          <p className="text-gray-600">
            Your construction management at a glance.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <InviteMemberModal />
        </div>
      </div>
    </Container>
  );
};

export default AdminHome;
