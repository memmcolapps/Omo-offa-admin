"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { Download } from "lucide-react";

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
    stateOfResidence: "",
    countryOfResidence: "",
    localGovernmentAreaOfResidence: "",
    addressOfResidence: "",
    compoundName: "",
    wardName: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    employmentStatus: "",
    indigeneByWho: "",
    adoptedParentName: "",
    adoptedParentCompound: "",
    adoptedParentWard: "",
    numOfCurrentDependants: "",
    genotype: "",
    physicalChallenges: "",
    email: "",
    phoneNumber: "",
    secondPhoneNumber: "",
    nin: "",
    occupation: "",
    bankName: "",
    sex: "",
    religion: "",
    bloodGroup: "",
    // Additional info fields
    dob: "",
    placeOfBirth: "",
    fathersName: "",
    fathersPlaceOfBirth: "",
    fathersPhoneNumber: "",
    mothersPhoneNumber: "",
    mothersFatherName: "",
    mothersHomeTown: "",
    mothersCompound: "",
    mothersName: "",
    mothersPlaceOfBirth: "",
  });

  // Initialize form data from user prop
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        ...Object.fromEntries(
          Object.entries(user).filter(([key]) => key in prevData)
        ),
        // Handle nested info object
        ...(user.info &&
          Object.fromEntries(
            Object.entries(user.info).filter(([key]) => key in prevData)
          )),
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
      // Ensure NIN is not updated — remove it from the payload
      const payloadToSend = { ...formData };
      if (Object.prototype.hasOwnProperty.call(payloadToSend, "nin"))
        delete payloadToSend.nin;
      await editData(payloadToSend, user.offaNimiId, token);
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

  const handleDownloadProfilePic = async () => {
    if (!user?.profilePicUrl) return;

    try {
      const response = await fetch(user.profilePicUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${user.offaNimiId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Profile picture downloaded successfully");
    } catch (error) {
      console.error("Error downloading profile picture:", error);
      toast.error("Error downloading profile picture");
    }
  };

  const formFields = [
    // Basic Information
    { label: "First Name", name: "firstName" },
    { label: "Last Name", name: "lastName" },
    { label: "Middle Name", name: "middleName" },
    { label: "Date of Birth", name: "dob", type: "date" },
    { label: "Place of Birth", name: "placeOfBirth" },
    { label: "NIN", name: "nin" },
    {
      label: "Genotype",
      name: "genotype",
      type: "select",
      options: ["AA", "AS", "SS", "AC", "SC", "CC"],
    },
    { label: "Physical Challenges", name: "physicalChallenges" },
    {
      label: "Sex",
      name: "sex",
      type: "select",
      options: ["Male", "Female", "Other"],
    },
    {
      label: "Religion",
      name: "religion",
      type: "select",
      options: ["Christianity", "Islam", "Traditional"],
    },
    {
      label: "Blood Group",
      name: "bloodGroup",
      type: "select",
      options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    // Contact Information
    { label: "Current Phone Number", name: "phoneNumber", type: "tel" },
    { label: "Second Phone Number", name: "secondPhoneNumber", type: "tel" },
    { label: "Current E-mail Address", name: "email", type: "email" },
    { label: "Emergency Contact Name", name: "emergencyContactName" },
    {
      label: "Emergency Contact Number",
      name: "emergencyContactNumber",
      type: "tel",
    },

    // Residence Information
    { label: "Town/City of Residence", name: "cityOfResidence" },
    { label: "State of Residence", name: "stateOfResidence" },
    { label: "Country of Residence", name: "countryOfResidence" },
    {
      label: "Local Govt. of Residence",
      name: "localGovernmentAreaOfResidence",
    },
    { label: "Address of Residence", name: "addressOfResidence" },
    { label: "Compound Name", name: "compoundName" },
    { label: "Ward Name", name: "wardName" },

    // Employment & Financial
    {
      label: "Occupation",
      name: "occupation",
      type: "select",
      options: [
        "Unemployed",
        "Student",
        "Civil Servant",
        "Self-Employed",
        "Trader",
        "Farmer",
        "Teacher",
        "Healthcare Worker",
        "Engineer",
        "Other",
      ],
    },
    {
      label: "Employment Status",
      name: "employmentStatus",
      type: "select",
      options: [
        "Employed",
        "Self-employed",
        "Part-time",
        "Contract",
        "Unemployed",
        "Student",
        "Retired",
      ],
    },
    { label: "Bank Name", name: "bankName" },
    {
      label: "Number of Current Dependants",
      name: "numOfCurrentDependants",
      type: "number",
    },

    // Indigene Information
    {
      label: "How are you an Offa Indigene?",
      name: "indigeneByWho",
      type: "select",
      options: [
        "By Father and Mother",
        "By Father only",
        "By Mother only",
        "By Adoption",
        "By Residence",
        "By Marriage",
      ],
    },
    { label: "Adopted Parent Name", name: "adoptedParentName" },
    { label: "Adopted Parent Compound", name: "adoptedParentCompound" },
    { label: "Adopted Parent Ward", name: "adoptedParentWard" },

    // Father's Information
    { label: "Father's Name", name: "fathersName" },
    { label: "Father's Place of Birth", name: "fathersPlaceOfBirth" },
    { label: "Father's Phone Number", name: "fathersPhoneNumber", type: "tel" },

    // Mother's Information
    { label: "Mother's Name", name: "mothersName" },
    { label: "Mother's Place of Birth", name: "mothersPlaceOfBirth" },
    { label: "Mother's Phone Number", name: "mothersPhoneNumber", type: "tel" },
    { label: "Mother's Father Name", name: "mothersFatherName" },
    { label: "Mother's Home Town", name: "mothersHomeTown" },
    { label: "Mother's Compound", name: "mothersCompound" },
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
            <div className="relative w-32 h-32">
              {user?.profilePicUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={user.profilePicUrl}
                    alt={`${user.firstName} ${user.lastName} profile`}
                    className="rounded-full object-cover"
                    fill
                    priority
                    sizes="(max-width: 128px) 100vw, 128px"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <Image
                    src="/home/offa_logo.svg"
                    alt="Default profile"
                    className="rounded-full object-cover hidden"
                    fill
                    priority
                    sizes="(max-width: 128px) 100vw, 128px"
                  />
                </div>
              ) : (
                <Image
                  src="/home/offa_logo.svg"
                  alt="Default profile"
                  className="rounded-full object-cover"
                  fill
                  priority
                  sizes="(max-width: 128px) 100vw, 128px"
                />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
              <div className="flex flex-wrap gap-4">
                {user?.profilePicUrl && (
                  <button
                    className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors flex items-center gap-2"
                    onClick={handleDownloadProfilePic}
                  >
                    <Download size={16} />
                    Download Photo
                  </button>
                )}
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

        <div className="space-y-8">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields
                .slice(0, 11)
                .map(({ label, name, type = "text", options }) => (
                  <div key={name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      >
                        <option value="">Select an option</option>
                        {(options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        readOnly={name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Contact Information
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields
                .slice(11, 16)
                .map(({ label, name, type = "text", options }) => (
                  <div key={name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      >
                        <option value="">Select an option</option>
                        {(options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        readOnly={name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Residence Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Residence Information
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields
                .slice(16, 23)
                .map(({ label, name, type = "text", options }) => (
                  <div key={name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      >
                        <option value="">Select an option</option>
                        {(options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        readOnly={name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Employment & Financial Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Employment & Financial
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields
                .slice(23, 27)
                .map(({ label, name, type = "text", options }) => (
                  <div key={name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      >
                        <option value="">Select an option</option>
                        {(options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        readOnly={name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Indigene Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Indigene Information
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields
                .slice(27, 31)
                .map(({ label, name, type = "text", options }) => (
                  <div key={name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      >
                        <option value="">Select an option</option>
                        {(options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        readOnly={name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Father's Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Father&apos;s Information
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields
                .slice(31, 34)
                .map(({ label, name, type = "text", options }) => (
                  <div key={name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    {type === "select" ? (
                      <select
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      >
                        <option value="">Select an option</option>
                        {(options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "nin"}
                        readOnly={name === "nin"}
                        title={
                          name === "nin" ? "NIN cannot be edited" : undefined
                        }
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Mother's Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Mother&apos;s Information
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields
                .slice(34, 40)
                .map(({ label, name, type = "text" }) => (
                  <div key={name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                      value={formData[name] || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing || name === "nin"}
                      readOnly={name === "nin"}
                      title={
                        name === "nin" ? "NIN cannot be edited" : undefined
                      }
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </MaxContainer>
  );
};

export default UserProfileForm;
