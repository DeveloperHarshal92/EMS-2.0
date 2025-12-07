import { useContext, useEffect, useState } from "react";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import Login from "./pages/Login";
import { getLocalStorage } from "./utils/localStorage";
import { AuthContext } from "./context/AuthProvider";

const App = () => {
  const [user, setUser] = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [userData, setUserdata] = useContext(AuthContext);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser", "");

    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setUser({ role: userData.role });
      setLoggedInUserData(userData.data);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== "employee") return;
    if (!userData || !loggedInUserData) return;

    const freshEmployee = userData.find(
      (emp) => emp.id === loggedInUserData.id
    );

    if (freshEmployee) {
      setLoggedInUserData(freshEmployee);
    }
  }, [userData, user, loggedInUserData]); 

  const handleLogin = (email, password) => {
    if (!userData) return;

    const { admin } = getLocalStorage();

    const adminUser = admin.find(
      (e) => e.email === email && e.password === password
    );

    if (adminUser) {
      setUser({ role: "admin" });
      setLoggedInUserData(adminUser);
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ role: "admin", data: adminUser })
      );
      return;
    }

    const employee = userData.find(
      (e) => e.email === email && e.password === password
    );

    if (employee) {
      setUser({ role: "employee" });
      setLoggedInUserData(employee);
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ role: "employee", data: employee })
      );
      return;
    }

    alert("Invalid Credentials!!!");
  };

  return (
    <>
      {!user && <Login handleLogin={handleLogin} />}

      {user?.role === "admin" && (
        <AdminDashboard changeUser={setUser} data={loggedInUserData} />
      )}

      {user?.role === "employee" && (
        <EmployeeDashboard changeUser={setUser} data={loggedInUserData} />
      )}
    </>
  );
};

export default App;
