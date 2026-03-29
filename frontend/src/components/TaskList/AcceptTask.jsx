import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const AcceptTask = ({ data }) => {
  const [userData, setUserdata] = useContext(AuthContext);

  const handleAccept = () => {
    if (!userData) return;

    const updatedEmployees = userData.map((emp) => {
      const taskIndex = emp.tasks.findIndex(
        (task) => task.title === data.title && task.newTask === true
      );

      if (taskIndex !== -1) {
        const updatedTasks = [...emp.tasks];

        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          newTask: false,
          active: true,
        };

        return {
          ...emp,
          tasks: updatedTasks,
          taskCount: {
            ...emp.taskCount,
            newTask: emp.taskCount.newTask - 1,
            active: emp.taskCount.active + 1,
          },
        };
      }

      return emp;
    });

    setUserdata(updatedEmployees);
  };

  return (
    <div className="w-[300px] bg-yellow-500 p-5 rounded-xl text-black flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold">{data.title}</h2>
        <p className="text-sm mt-2">{data.description}</p>

        <div className="flex justify-between mt-3 text-xs">
          <span>{data.category}</span>
          <span>{data.date}</span>
        </div>
      </div>

      <button
        onClick={handleAccept}
        className="mt-4 bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-900"
      >
        Accept Task
      </button>
    </div>
  );
};

export default AcceptTask;
