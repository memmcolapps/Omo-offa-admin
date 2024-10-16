import Sidebar from "../components/common/sidebar";
import Navbar from "../components/common/navbar";
const ApprovedUsers = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Navbar pageName={"Approved Users"} />
    </div>
  );
};

export default ApprovedUsers;
