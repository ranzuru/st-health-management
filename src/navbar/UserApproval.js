import React from "react";
import UserApprovalGrid from "../datagrid/UserApprovalGrid.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

const ManageUsers = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-hidden">
        <Header title="User Approval" />
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="flex items-center justify-center w-full">
            <UserApprovalGrid />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
export default ManageUsers;
