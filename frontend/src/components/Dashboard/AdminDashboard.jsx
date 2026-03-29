import React from "react";
import Header from "../Others/Header";
import CreateTask from "../Others/CreateTask";
import AllTask from "../Others/AllTask";
import AdminSummary from "./AdminSummary";

const AdminDashboard = ({changeUser,data}) => {
  return (
    <div className="h-screen w-full p-10">
      <Header changeUser={changeUser}  data={data}/>
      <AdminSummary/>
      <CreateTask />
      <AllTask />
    </div>
  );
};

export default AdminDashboard;
