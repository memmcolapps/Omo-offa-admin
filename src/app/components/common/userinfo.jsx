"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { Download } from "lucide-react";

import MaxContainer from "./maxcontainer";
import useChangeUserStatus from "../../hooks/useChangeUserStatus";
import useEditUserData from "../../hooks/useEditUserData";
import useCompounds from "../../hooks/useCompounds";
import { useUser } from "../../context/UserContext";

// Helper functions to transform between API and display formats
const transformApiToDisplay = (value, type) => {
  if (!value) return "";
  
  if (type === "occupation") {
    // Map API uppercase values to title case display values
    const occupationMap = {
      "BANKING": "Banking",
      "TELECOMMUNICATION": "Telecommunication",
      "OIL AND GAS": "Oil and Gas",
      "INFORMATION TECHNOLOGY": "Information Technology",
      "LEGAL AFFAIRS": "Legal Affairs",
      "AIRLINES": "Airlines",
      "ENGINEERING": "Engineering",
      "MANUFACTURING": "Manufacturing",
      "ACADEMIC": "Academic",
      "TRADING": "Trading",
      "MEDICAL": "Medical",
      "CIVIL SERVICE": "Civil Service",
      "MILITARY": "Military",
      "OTHERS": "Others",
    };
    return occupationMap[value] || value;
  }
  
  if (type === "religion") {
    // Map API uppercase values to title case display values
    const religionMap = {
      "ISLAM": "Islam",
      "CHRISTIANITY": "Christianity",
      "TRADITIONAL RELIGION": "Traditional Religion",
    };
    return religionMap[value] || value;
  }
  
  return value;
};

const transformDisplayToApi = (value, type) => {
  if (!value) return "";
  
  if (type === "occupation") {
    // Map display values back to API uppercase format
    const occupationMap = {
      "Banking": "BANKING",
      "Telecommunication": "TELECOMMUNICATION",
      "Oil and Gas": "OIL AND GAS",
      "Information Technology": "INFORMATION TECHNOLOGY",
      "Legal Affairs": "LEGAL AFFAIRS",
      "Airlines": "AIRLINES",
      "Engineering": "ENGINEERING",
      "Manufacturing": "MANUFACTURING",
      "Academic": "ACADEMIC",
      "Trading": "TRADING",
      "Medical": "MEDICAL",
      "Civil Service": "CIVIL SERVICE",
      "Military": "MILITARY",
      "Others": "OTHERS",
    };
    return occupationMap[value] || value;
  }
  
  if (type === "religion") {
    // Map display values back to API format
    const religionMap = {
      "Islam": "Islam",
      "Christianity": "Christianity",
      "Traditional Religion": "Traditional Religion",
    };
    return religionMap[value] || value;
  }
  
  return value;
};

const UserProfileForm = ({ user, showApproveReject }) => {
  const router = useRouter();
  const { changeStatus, loading } = useChangeUserStatus();
  const { editData } = useEditUserData();
  const { user: admin } = useUser();
  const { compounds, loadCompounds } = useCompounds();

  // Consolidated state management
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [canApprove, setCanApprove] = useState(false);
  const [status, setStatus] = useState(user?.status);

  const [formData, setFormData] = useState({
    title: "",
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
    maritalStatus: "",
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
    // User status and additional fields
    isDeceased: false,
    idPayment: false,
    deliveryStatus: "",
    parentNin: "",
    signature: "",
    verificationStatus: "",
    fingerprintCaptured: false,
  });

  // Initialize form data from user prop - includes ALL available fields except excluded ones
  useEffect(() => {
    if (user) {
      // Combine user data and nested info object into a single object
      const allUserData = {
        ...user,
        ...(user.info || {}),
      };

      // Filter out offaNimiId from editable fields - it will be displayed separately
      // Also filter out fields that should not be displayed (including all Legend fields)
      const {
        offaNimiId,
        id,
        userId,
        profilePicUrl,
        profilePicture,
        profilePicBase64,
        password,
        ninData,
        cityLagend,
        socioProCode,
        ...editableData
      } = allUserData;

      // Transform API values to display format
      const transformedData = {
        ...editableData,
        occupation: transformApiToDisplay(editableData.occupation, "occupation"),
        religion: transformApiToDisplay(editableData.religion, "religion"),
      };

      setFormData((prevData) => ({
        ...prevData,
        ...transformedData,
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

  // Load compounds on component mount - only run once
  useEffect(() => {
    loadCompounds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");

      // Define which fields belong to userInfo (from UserInfo model)
      const userInfoFields = [
        "dob",
        "placeOfBirth",
        "fathersName",
        "fathersPlaceOfBirth",
        "mothersName",
        "mothersPlaceOfBirth",
        "fathersPhoneNumber",
        "mothersPhoneNumber",
        "mothersFatherName",
        "mothersHomeTown",
        "mothersCompound",
        "religion",
        "sex",
        "secondPhoneNumber",
        "bloodGroup",
      ];

      // Separate user data and userInfo data
      const userData = {};
      const infoData = {};

      Object.entries(formData).forEach(([key, value]) => {
        if (userInfoFields.includes(key)) {
          // Transform religion back to API format
          infoData[key] = key === "religion" ? transformDisplayToApi(value, "religion") : value;
        } else if (key !== "offaNimiId") {
          // Transform occupation back to API format
          userData[key] = key === "occupation" ? transformDisplayToApi(value, "occupation") : value;
        }
      });

      // Construct payload with nested info object
      const payloadToSend = {
        ...userData,
        info: infoData,
      };

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
    {
      label: "Title",
      name: "title",
      type: "select",
      options: ["MR", "MRS", "MISS", "DR", "PROF", "ENGR", "CHIEF"],
    },
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
      options: ["Islam", "Christianity", "Traditional Religion"],
    },
    {
      label: "Blood Group",
      name: "bloodGroup",
      type: "select",
      options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    {
      label: "Marital Status",
      name: "maritalStatus",
      type: "select",
      options: ["Single", "Married", "Widowed", "Divorced"],
    },
    {
      label: "Fingerprint Captured",
      name: "fingerprintCaptured",
      type: "badge",
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
    { label: "Compound Name", name: "compoundName", type: "compoundSelect" },
    {
      label: "Ward Name",
      name: "wardName",
      type: "select",
      options: ["Asalofa", "Balogun", "Essa", "Ojomu", "Shawo"],
    },

    // Employment & Financial
    {
      label: "Occupation",
      name: "occupation",
      type: "select",
      options: [
        "Banking",
        "Telecommunication",
        "Oil and Gas",
        "Information Technology",
        "Legal Affairs",
        "Airlines",
        "Engineering",
        "Manufacturing",
        "Academic",
        "Trading",
        "Medical",
        "Civil Service",
        "Military",
        "Others",
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

    // Status & Verification
    {
      label: "Deceased",
      name: "isDeceased",
      type: "select",
      options: ["true", "false"],
    },
    {
      label: "ID Payment",
      name: "idPayment",
      type: "view",
    },
    {
      label: "Delivery Status",
      name: "deliveryStatus",
      type: "view",
    },
    {
      label: "Verification Status",
      name: "verificationStatus",
      type: "view",
    },

    // Additional Fields
    { label: "Parent NIN", name: "parentNin" },
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
              {user?.offaNimiId && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OffaNimi ID
                  </label>
                  <div className="w-full max-w-xs p-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 font-medium">
                    {user.offaNimiId}
                  </div>
                </div>
              )}
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
                .slice(0, 14)
                .map(({ label, name, type = "text", options }) => (
                  <div key={name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    {type === "badge" ? (
                      <div className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user?.fingerprintCaptured
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user?.fingerprintCaptured
                            ? "Captured"
                            : "Not Captured"}
                        </span>
                      </div>
                    ) : type === "select" ? (
                      <select
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
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
                        disabled={!isEditing || name === "offaNimiId"}
                        readOnly={name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
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
                .slice(14, 19)
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
                        disabled={!isEditing || name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
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
                        disabled={!isEditing || name === "offaNimiId"}
                        readOnly={name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
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
                .slice(19, 26)
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
                        disabled={!isEditing || name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
                        }
                      >
                        <option value="">Select an option</option>
                        {(options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : type === "compoundSelect" ? (
                      <select
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
                        }
                      >
                        <option value="">Select a compound</option>
                        {compounds.map((compound) => (
                          <option key={compound.id} value={compound.name}>
                            {compound.name}
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
                        disabled={!isEditing || name === "offaNimiId"}
                        readOnly={name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
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
                .slice(26, 30)
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
                        disabled={!isEditing || name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
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
                        disabled={!isEditing || name === "offaNimiId"}
                        readOnly={name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
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
                .slice(30, 34)
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
                        disabled={!isEditing || name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
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
                        disabled={!isEditing || name === "offaNimiId"}
                        readOnly={name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
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
                .slice(34, 37)
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
                        disabled={!isEditing || name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
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
                        disabled={!isEditing || name === "offaNimiId"}
                        readOnly={name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
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
                .slice(37, 43)
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
                      disabled={!isEditing || name === "offaNimiId"}
                      readOnly={name === "offaNimiId"}
                      title={
                        name === "offaNimiId"
                          ? "OffaNimi ID cannot be edited"
                          : undefined
                      }
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Status & Verification Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Status & Verification
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields
                .slice(43, 47)
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
                        disabled={!isEditing || name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
                        }
                      >
                        <option value="">Select an option</option>
                        {(options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt === "true"
                              ? "Yes"
                              : opt === "false"
                                ? "No"
                                : opt}
                          </option>
                        ))}
                      </select>
                    ) : type === "view" ? (
                      <div className="w-full p-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 font-medium">
                        {name === "idPayment"
                          ? formData[name]
                            ? "Yes"
                            : "No"
                          : formData[name] || "N/A"}
                      </div>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing || name === "offaNimiId"}
                        readOnly={name === "offaNimiId"}
                        title={
                          name === "offaNimiId"
                            ? "OffaNimi ID cannot be edited"
                            : undefined
                        }
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Additional Fields Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Additional Fields
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields
                .slice(47, 49)
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
                      disabled={!isEditing || name === "offaNimiId"}
                      readOnly={name === "offaNimiId"}
                      title={
                        name === "offaNimiId"
                          ? "OffaNimi ID cannot be edited"
                          : undefined
                      }
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Additional Information Section - Dynamic fields not in predefined sections */}
          {(() => {
            const definedFieldNames = new Set(formFields.map((f) => f.name));
            const excludedFields = new Set([
              "offaNimiId",
              "id",
              "userId",
              "profilePicUrl",
              "profilePicture",
              "profilePicBase64",
              "password",
              "ninData",
              "cityLagend",
              "socioProCode",
              "status",
              "createdAt",
              "updatedAt",
              "info",
            ]);

            const additionalFields = Object.entries(formData).filter(
              ([key, value]) =>
                !definedFieldNames.has(key) &&
                !excludedFields.has(key) &&
                !key.endsWith("Legend") &&
                value !== "" &&
                value !== null &&
                value !== undefined,
            );

            if (additionalFields.length === 0) return null;

            return (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Additional Information
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {additionalFields.map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      <input
                        type="text"
                        name={key}
                        className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        value={formData[key] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </MaxContainer>
  );
};

export default UserProfileForm;
