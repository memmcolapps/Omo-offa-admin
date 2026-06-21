import * as XLSX from "xlsx";

export const downloadCSV = (reportData) => {
  if (!reportData || reportData.length === 0) {
    alert("No data to download.");
    return;
  }

  // Flatten nested objects (e.g., info) into top-level keys
  const flattenedData = reportData.map((row) => {
    const flatRow = {};
    Object.entries(row).forEach(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          const finalKey = Object.prototype.hasOwnProperty.call(flatRow, nestedKey)
            ? `${key}_${nestedKey}`
            : nestedKey;
          flatRow[finalKey] = nestedValue;
        });
      } else {
        flatRow[key] = value;
      }
    });
    return flatRow;
  });

  // Keys to exclude from CSV export
  const excludedKeys = new Set([
    "userId",
    "info_id",
    "id",
    "signature",
    "profilePicUrl",
    "profilePicBase64",
    "updatedAt",
    "info_createdAt",
    "info_updatedAt",
    "cityLagend",
    "stateLegend",
    "socioProCode",
    "productCodeLegend",
    "titleLegend",
    "sexLegend",
  ]);

  // Collect all unique keys across all rows, excluding unwanted ones
  const keySet = new Set();
  flattenedData.forEach((row) =>
    Object.keys(row).forEach((k) => {
      if (!excludedKeys.has(k)) keySet.add(k);
    })
  );
  const keys = Array.from(keySet);

  const csvData = [
    keys.join(","), // CSV header
    ...flattenedData.map((row) =>
      keys
        .map((key) => {
          let value = row[key];
          if (value === null || value === undefined) {
            value = "";
          }
          if (key === "createdAt" && value) {
            value = new Date(value).toISOString().split("T")[0];
          }
          // Fallback: stringify any remaining objects
          if (typeof value === "object") {
            value = JSON.stringify(value);
          }
          // Remove commas from address fields to avoid column breaks
          if (
            typeof value === "string" &&
            typeof key === "string" &&
            key.toLowerCase().includes("address")
          ) {
            value = value.replace(/,/g, "");
          }
          // Escape any commas within the data
          if (typeof value === "string" && value.includes(",")) {
            value = `"${value.replace(/"/g, '""')}"`; // Escape quotes and wrap in quotes
          }
          return value;
        })
        .join(",")
    ),
  ].join("\n");

  // Create a Blob and a download link
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "report.csv"); // Set the filename
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Clean up
  URL.revokeObjectURL(url); // Clean up the URL object
};

export const downloadApprovedUsersCSV = (selectedUsers) => {
  if (!selectedUsers || selectedUsers.length === 0) {
    alert("No users selected for download.");
    return;
  }

  const headers = [
    "firstName",
    "lastName",
    "middleName",
    "cityOfResidence",
    "stateOfResidence",
    "countryOfResidence",
    "localGovernmentAreaOfResidence",
    "addressOfResidence",
    "compoundName",
    "offaNimiId",
    "issuedDate",
    "religion",
    "sex",
    "bloodGroup",
    "dob",
    "emergencyContactName",
  ];

  const csvData = [
    headers.join(","), // CSV header
    ...selectedUsers.map((user) => {
      return headers
        .map((header) => {
          let value;

          switch (header) {
            case "dob":
              value = user.info?.dob || "";
              break;
            case "religion":
              value = user.info?.religion || "";
              break;
            case "sex":
              value = user.info?.sex || "";
              break;
            case "bloodGroup":
              value = user.info?.bloodGroup || "";
              break;
            case "issuedDate":
              value = new Date().toISOString().split("T")[0];
              break;
            default:
              value = user[header] || "";
          }

          if (value === null || value === undefined) {
            value = "";
          }

          if (
            typeof value === "string" &&
            typeof header === "string" &&
            header.toLowerCase().includes("address")
          ) {
            value = value.replace(/,/g, "");
          }

          if (typeof value === "string" && value.includes(",")) {
            value = `"${value.replace(/"/g, '""')}"`; // Escape quotes and wrap in quotes
          }

          return value;
        })
        .join(",");
    }),
  ].join("\n");

  // Create a Blob and a download link
  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `approved_users_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Clean up
  URL.revokeObjectURL(url); // Clean up the URL object
};

export const downloadForBankExcel = (selectedUsers) => {
  if (!selectedUsers || selectedUsers.length === 0) {
    alert("No users selected for download.");
    return;
  }

  const headers = ID_CARD_DOWNLOAD_COLUMNS.map((column) => column.header);

  const rows = selectedUsers.map((user) => {
    return ID_CARD_DOWNLOAD_COLUMNS.map((column) => {
      const value = column.value(user);
      return value ?? "";
    });
  });

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  worksheet["!cols"] = ID_CARD_DOWNLOAD_COLUMNS.map((column) => ({
    wch: Math.max(column.header.length + 2, 14),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Users");

  XLSX.writeFile(
    workbook,
    `approved_users_${new Date().toISOString().split("T")[0]}.xlsx`
  );
};

const ID_CARD_DOWNLOAD_COLUMNS = [
  { letter: "A", header: "First Name", value: (user) => user.firstName || "" },
  { letter: "B", header: " Middle Name", value: (user) => user.middleName || "" },
  { letter: "C", header: "Last Name", value: (user) => user.lastName || "" },
  {
    letter: "D",
    header: "Sex (Sex Legend)",
    value: (user) => user.info?.sexLegend || "",
  },
  {
    letter: "E",
    header: "Marital Status (Marital Status Legend)",
    value: (user) => user.info?.maritalStatusLegend || "",
  },
  { letter: "F", header: "Office Phone No", value: (user) => user.phoneNumber || "" },
  { letter: "G", header: "GSM No", value: (user) => user.phoneNumber || "" },
  { letter: "H", header: "Email Address", value: (user) => user.email || "" },
  {
    letter: "I",
    header: "Office Address 1",
    value: (user) => user.addressOfResidence || "",
  },
  {
    letter: "J",
    header: "Office Address 2",
    value: (user) => user.addressOfResidence || "",
  },
  {
    letter: "K",
    header: "City (City Legend)",
    value: (user) => user.info?.cityLagend || "",
  },
  {
    letter: "L",
    header: "State (State Legend)",
    value: (user) => user.info?.stateLegend || "",
  },
  {
    letter: "M",
    header: "Requesting Branch Code",
    value: (user) => user.info?.requestingBranch || "",
  },
  { letter: "N", header: "Main Account No", value: () => "" },
  { letter: "O", header: "Other Account No", value: () => "" },
  { letter: "P", header: "Name on Card", value: (user) => getFullName(user) },
  { letter: "Q", header: "ID Card Type (ID Card Type Legend)", value: () => "02" },
  { letter: "R", header: "ID No", value: (user) => user.nin || "" },
  {
    letter: "S",
    header: "ID Issue Date (dd/mm/yyyy)",
    value: (user) => user.info?.idIssueDate || "",
  },
  {
    letter: "T",
    header: "ID Expiry Date(dd/mm/yyyy)",
    value: (user) => user.info?.idExpiryDate || "",
  },
  {
    letter: "U",
    header: "Socio Prof Code (Socio Prof Code Legend)",
    value: (user) => user.info?.socioProCode || "",
  },
  {
    letter: "V",
    header: "Product Code (Product Code Legend)",
    value: (user) => user.info?.productCodeLegend || "",
  },
  {
    letter: "W",
    header: "Date of Birth (dd/mm/yyyy)",
    value: (user) => formatDate(user.info?.dob),
  },
  {
    letter: "X",
    header: "Title (Title Code Legend)",
    value: (user) => user.info?.titleLegend || "",
  },
  { letter: "Y", header: "Nationality (Nationality Code Legend)", value: () => "566" },
  {
    letter: "Z",
    header: "Batch No (Required if you need to Print Pin in Bulk from PinPro)",
    value: () => "",
  },
  { letter: "AA", header: "Company Name", value: () => "Omo Offa Nimi" },
  { letter: "AB", header: "OONM ID", value: (user) => user.offaNimiId || "" },
  { letter: "AC", header: "Compound Name", value: (user) => user.compoundName || "" },
  {
    letter: "AD",
    header: "Next of kin name",
    value: (user) => user.emergencyContactName || "",
  },
  {
    letter: "AE",
    header: "Next of kin phone number",
    value: (user) => user.emergencyContactNumber || "",
  },
  { letter: "AF", header: "Full name", value: (user) => getFullName(user) },
  {
    letter: "AG",
    header: "Current Residential Address",
    value: (user) => user.addressOfResidence || "",
  },
  {
    letter: "AH",
    header: "Current town/City",
    value: (user) => user.cityOfResidence || "",
  },
  { letter: "AI", header: "Compound name", value: (user) => user.compoundName || "" },
  { letter: "AJ", header: "Ward name", value: (user) => user.wardName || "" },
  { letter: "AK", header: "Blood group", value: (user) => user.info?.bloodGroup || "" },
  { letter: "AL", header: "Genotype", value: (user) => user.genotype || "" },
];

const getFullName = (user) =>
  [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");

const formatDate = (dateString) => {
  if (!dateString) return "";
  if (!dateString.includes("-")) return dateString;

  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;

  if (parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  return dateString;
};
