import Sidebar from "../components/common/sidebar";
import Navbar from "../components/common/navbar";
const PendingUsers = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Navbar pageName={"Pending Users"} />
    </div>
  );
};

export default PendingUsers;
