import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const FailedTask = ({ data }) => {
  const [userData, setUserdata] = useContext(AuthContext);

  return (
    <div className="w-[300px] bg-red-600 p-5 rounded-xl text-white flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold">{data.title}</h2>
        <p className="text-sm mt-2">{data.description}</p>

        <div className="flex justify-between mt-3 text-xs text-gray-200">
          <span>{data.category}</span>
          <span>{data.date}</span>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold">Failed ❌</p>
    </div>
  );
};

export default FailedTask;
