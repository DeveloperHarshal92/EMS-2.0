import Header from "../Others/Header";
import TaskListNumber from "../Others/TaskListNumber";
import TaskList from "../TaskList/TaskList";

const EmployeeDashboard = ({changeUser,data}) => {
  return (
    <div className="p-20 bg-[#1c1c1c] h-screen ">
      <Header changeUser={changeUser} data={data} />
      <TaskListNumber data={data} />
      <TaskList data={data} />
    </div>
  );
};

export default EmployeeDashboard;
