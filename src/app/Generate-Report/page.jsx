import Sidebar from "../components/common/sidebar";
import Navbar from "../components/common/navbar";
const GenerateReport = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Navbar pageName={"Generate Report"} />
    </div>
  );
};

export default GenerateReport;
