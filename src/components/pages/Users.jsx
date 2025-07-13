import React from "react";
import UsersTable from "@/components/organisms/UsersTable";

const Users = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-manrope text-gray-900 mb-2">
          Users Management
        </h1>
        <p className="text-gray-600">
          Manage user accounts, subscriptions, and access permissions
        </p>
      </div>
      
      <UsersTable />
    </div>
  );
};

export default Users;