import Sidebar from "../components/common/sidebar";
import Navbar from "../components/common/navbar";
const RejectedUsers = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Navbar pageName={"Rejected Users"} />
    </div>
  );
};

export default RejectedUsers;
