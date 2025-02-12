"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

import MaxContainer from "./maxcontainer";
import useChangeUserStatus from "../../hooks/useChangeUserStatus";
import useEditUserData from "../../hooks/useEditUserData"; // Fixed typo in import name
import { useUser } from "../../context/UserContext";

const UserProfileForm = ({ user, showApproveReject }) => {
  const router = useRouter();
  const { changeStatus, loading } = useChangeUserStatus();
  const { editData } = useEditUserData(); // Fixed hook name
  const { user: admin } = useUser();

  // Consolidated state management
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [canApprove, setCanApprove] = useState(false);
  const [status, setStatus] = useState(user?.status);

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    cityOfResidence: "",
    countryOfResidence: "",
    localGovernmentAreaOfResidence: "",
    addressOfResidence: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    employmentStatus: "",
    indigeneByWho: "",
    adoptedParentName: "",
    email: "",
    phoneNumber: "",
    nin: "",
  });

  // Initialize form data from user prop
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        ...Object.fromEntries(
          Object.entries(user).filter(([key]) => key in prevData)
        ),
      }));
    }
  }, [user]);

  // Check admin permissions
  useEffect(() => {
    if (admin) {
      const isSuperAdmin = admin?.adminType === "superadmin";
      setEditUser(isSuperAdmin || admin?.permissions?.user?.edit === true);
      setCanApprove(isSuperAdmin || admin?.permissions?.user?.approve === true);
    }
  }, [admin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      await editData(formData, user.offaNimiId, token);
      setIsEditing(false);
      router.back();
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Error saving changes");
    }
  };

  const handleStatusChange = async (adminStatusChoice) => {
    if (!user?.id) return;

    try {
      const token = localStorage.getItem("token");
      await changeStatus(user.id, adminStatusChoice, token);
      setStatus(adminStatusChoice);
      router.push("/Pending-Users");
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Error changing status");
    }
  };

  const formFields = [
    { label: "Last Name", name: "lastName" },
    { label: "First Name", name: "firstName" },
    { label: "Middle Name", name: "middleName" },
    { label: "Town/City of Residence", name: "cityOfResidence" },
    { label: "Country of Residence", name: "countryOfResidence" },
    {
      label: "Local Govt. of Residence",
      name: "localGovernmentAreaOfResidence",
    },
    { label: "Address of Residence", name: "addressOfResidence" },
    { label: "NIN", name: "nin" },
    { label: "Emergency Contact", name: "emergencyContactName" },
    { label: "Emergency Contact Number", name: "emergencyContactNumber" },
    { label: "Employment Status", name: "employmentStatus" },
    { label: "How are you an Offa Indigene?", name: "indigeneByWho" },
    { label: "Name of Adoptee", name: "adoptedParentName" },
    { label: "Current E-mail Address", name: "email", type: "email" },
    { label: "Current phone number", name: "phoneNumber", type: "tel" },
  ];

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            No User Available
          </h1>
          <p className="text-gray-600">Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <MaxContainer>
      <ToastContainer />
      <div className="max-w-6xl mx-auto p-6 lg:p-12 bg-white rounded-lg shadow-sm">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <Image
                src="/home/offa_logo.svg"
                alt="User profile"
                className="rounded-full"
                fill
                priority
                sizes="(max-width: 96px) 100vw, 96px"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
              <div className="flex flex-wrap gap-4">
                {showApproveReject && canApprove && (
                  <>
                    <button
                      className="px-6 py-2 text-white rounded-md bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-colors"
                      disabled={loading || status === "APPROVED"}
                      onClick={() => handleStatusChange("APPROVED")}
                    >
                      {loading && status === "APPROVED"
                        ? "Approving..."
                        : "Approve"}
                    </button>
                    <button
                      className="px-6 py-2 text-white rounded-md bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors"
                      disabled={loading || status === "REJECTED"}
                      onClick={() => handleStatusChange("REJECTED")}
                    >
                      {loading && status === "REJECTED"
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </>
                )}
                {editUser && (
                  <button
                    className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    onClick={
                      isEditing ? handleSaveChanges : () => setIsEditing(true)
                    }
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {formFields.map(({ label, name, type = "text" }) => (
            <div key={name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                name={name}
                className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                value={formData[name]}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          ))}
        </div>
      </div>
    </MaxContainer>
  );
};

export default UserProfileForm;
