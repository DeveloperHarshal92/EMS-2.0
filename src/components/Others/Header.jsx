import { setLocalStorage } from "../../utils/localStorage";

const Header = ({changeUser,data}) => {
  const logOutUser = () => {
    localStorage.setItem("loggedInUser", "");
    changeUser("")
    // window.location.reload();
  };

  return (
    <div className="flex items-end justify-between">
      <h1 className="text-white text-2xl font-medium">
        Hello <br />{" "}
        <span className="text-white text-3xl font-semibold">{data?.fname}</span>{" "}
        👋
      </h1>
      <button
        onClick={logOutUser}
        className="bg-red-500 text-lg font-medium text-white px-5 py-2 rounded-sm"
      >
        Log Out
      </button>
    </div>
  );
};

export default Header;
