import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const AdminSummary = () => {
  const [userData] = useContext(AuthContext); 

  if (!userData) return null;


  const totalEmployees = userData.length;

  
  let totalTasks = 0;
  let totalNew = 0;
  let totalActive = 0;
  let totalCompleted = 0;
  let totalFailed = 0;

  userData.forEach((emp) => {
    totalTasks += emp.tasks.length;
    totalNew += emp.taskCount.newTask;
    totalActive += emp.taskCount.active;
    totalCompleted += emp.taskCount.completed;
    totalFailed += emp.taskCount.failed;
  });

  return (
    <div className="grid grid-cols-3 gap-5 mb-10 mt-10">
      <div className="bg-[#2a2a2a] p-5 rounded text-white">
        <h3 className="text-sm text-gray-300">Total Employees</h3>
        <h2 className="text-3xl font-bold">{totalEmployees}</h2>
      </div>

      <div className="bg-[#2a2a2a] p-5 rounded text-white">
        <h3 className="text-sm text-gray-300">Total Tasks</h3>
        <h2 className="text-3xl font-bold">{totalTasks}</h2>
      </div>

      <div className="bg-blue-600 p-5 rounded text-white">
        <h3 className="text-sm">New Tasks</h3>
        <h2 className="text-3xl font-bold">{totalNew}</h2>
      </div>

      <div className="bg-yellow-500 p-5 rounded text-white">
        <h3 className="text-sm">Active Tasks</h3>
        <h2 className="text-3xl font-bold">{totalActive}</h2>
      </div>

      <div className="bg-green-600 p-5 rounded text-white">
        <h3 className="text-sm">Completed Tasks</h3>
        <h2 className="text-3xl font-bold">{totalCompleted}</h2>
      </div>

      <div className="bg-red-600 p-5 rounded text-white">
        <h3 className="text-sm">Failed Tasks</h3>
        <h2 className="text-3xl font-bold">{totalFailed}</h2>
      </div>
    </div>
  );
};

export default AdminSummary;
