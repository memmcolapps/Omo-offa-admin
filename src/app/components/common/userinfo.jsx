"use client";
import React, { useState, useEffect } from "react";
import MaxContainer from "./maxcontainer";
import Image from "next/image";
import useChangeUserStatus from "@/app/hooks/useChangeUserStatus";
import { useRouter } from "next/navigation";
import useEditUderData from "@/app/hooks/useEditUserData";
import { useUser } from "@/app/context/UserContext";

const UserProfileForm = ({ user, showApproveReject }) => {
  const router = useRouter();
  const { changeStatus, data, loading } = useChangeUserStatus();
  const { editData } = useEditUderData();
  const [status, setStatus] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const { user: admin } = useUser();
  const [editUser, setEditUser] = useState(false);
  const [canApprove, setCanApprove] = useState(false);

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

  useEffect(() => {
    if (user) {
      setFormData({
        lastName: user.lastName || "",
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        cityOfResidence: user.cityOfResidence || "",
        countryOfResidence: user.countryOfResidence || "",
        localGovernmentAreaOfResidence:
          user.localGovernmentAreaOfResidence || "",
        addressOfResidence: user.addressOfResidence || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactNumber: user.emergencyContactNumber || "",
        employmentStatus: user.employmentStatus || "",
        indigeneByWho: user.indigeneByWho || "",
        adoptedParentName: user.adoptedParentName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        nin: user.nin || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (admin) {
      console.log("Admin", admin);
      const isSuperAdmin = admin?.adminType === "superadmin";
      console.log("Is super admin", isSuperAdmin);
      const canEditUser =
        isSuperAdmin || admin?.permissions?.user?.edit === true;
      const canApprove =
        isSuperAdmin || admin?.permissions?.user?.approve === true;

      console.log("Can edit user", canEditUser);
      console.log("Can approve user", canApprove);
      setEditUser(canEditUser);
      setCanApprove(canApprove);
    }
  }, [admin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    console.log("Saving user data:", formData);
    editData(formData, user.offaNimiId, localStorage.getItem("token"));
    setIsEditing(false);
    router.back();
  };

  const handleStatusChange = (adminStatusChoice) => {
    if (user) {
      changeStatus(user.id, adminStatusChoice, localStorage.getItem("token"));
      router.push(`/Pending-Users`);
      setStatus(adminStatusChoice);
    }
  };

  const renderFormField = ({ label, name, type = "text" }) => (
    <div key={name}>
      <label className="block text-[1.2rem] text-gray-600 mb-[1rem]">
        {label}
      </label>
      <input
        type={type}
        name={name}
        className="w-full p-3 rounded-lg bg-gray-100"
        value={formData[name]}
        onChange={handleInputChange}
        disabled={!isEditing}
      />
    </div>
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            No User Available
          </h1>
          <p className="text-gray-600">
            There is no user at the moment. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <MaxContainer>
      <div className="max-w-6xl mx-auto p-[6rem] bg-white">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <Image
                src="/home/offa_logo.svg"
                alt="User"
                className="rounded-full mr-2"
                height={400}
                width={400}
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-[1rem]">User Status</h2>
              <div className="flex gap-4 text-[1.2rem]">
                {showApproveReject && canApprove ? (
                  <>
                    <button
                      className={`px-[1.5rem] py-[1rem] text-white rounded-md bg-[#002E20] hover:bg-green-600`}
                      disabled={loading || status === "APPROVED"}
                      onClick={() => handleStatusChange("APPROVED")}
                    >
                      {loading && status === "APPROVED"
                        ? "Approving..."
                        : "Approve"}
                    </button>
                    <button
                      className={`px-[1.5rem] py-[1rem] text-white rounded-md bg-gray-500 hover:bg-red-600`}
                      disabled={loading || status === "REJECTED"}
                      onClick={() => handleStatusChange("REJECTED")}
                    >
                      {loading && status === "REJECTED"
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </>
                ) : null}
                {editUser ? (
                  <button
                    className="px-[1.5rem] py-[1rem] text-[#C8FFC4] bg-[#002E20] hover:bg-blue-600 rounded-md"
                    onClick={isEditing ? handleSaveChanges : handleEditClick}
                  >
                    {isEditing
                      ? "Save user information"
                      : "Edit user information"}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 text-[1.5rem]">
          <div className="space-y-6">
            {[
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
            ].map(({ label, name }) => renderFormField({ label, name }))}
          </div>
          <div className="space-y-6">
            {[
              { label: "Emergency Contact", name: "emergencyContactName" },
              {
                label: "Emergency Contact Number",
                name: "emergencyContactNumber",
              },
              { label: "Employment Status", name: "employmentStatus" },
              { label: "How are you an Offa Indigene?", name: "indigeneByWho" },
              { label: "Name of Adoptee", name: "adoptedParentName" },
              { label: "Current E-mail Address", name: "email", type: "email" },
              { label: "Current phone number", name: "phoneNumber" },
            ].map(({ label, name, type }) =>
              renderFormField({ label, name, type })
            )}
          </div>
        </div>
      </div>
    </MaxContainer>
  );
};

export default UserProfileForm;
