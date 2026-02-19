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
    "createdAt",
    "updatedAt",
    "info_createdAt",
    "info_updatedAt",
    "cityLagend",
    "stateLegend",
    "socioProCode",
    "productCodeLegend",
    "cardType",
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

  const headers = [
    "First Name",
    "Middle Name",
    "Last Name",
    "Sex (Sex Legend)",
    "Marital Status (Marital Status Legend)",
    "Office Phone No",
    "Email Address",
    "GSM No",
    "Office Address 1",
    "Office Address 2",
    "City (City Legend)",
    "State (State Legend)",
    "Requesting Branch Code",
    "Name on Card",
    "ID Card Type (ID Card Type Legend)",
    "ID No",
    "ID Issue Date (dd/mm/yyyy)",
    "ID Expiry Date(dd/mm/yyyy)",
    "Socio Prof Code (Socio Prof Code Legend)",
    "Product Code (Product Code Legend)",
    "Date of Birth (dd/mm/yyyy)",
    "Title (Title Code Legend)",
    "Nationality (Nationality Code Legend)",
    "Company Name",
    "OONM Unique ID",
  ];

  const rows = selectedUsers.map((user) => {
    return headers.map((header) => {
      let value;

      switch (header) {
        case "First Name":
          value = user.firstName || "";
          break;
        case "Middle Name":
          value = user.middleName || "";
          break;
        case "Last Name":
          value = user.lastName || "";
          break;
        case "Sex (Sex Legend)":
          value = user.info?.sexLegend || "";
          break;
        case "Email Address":
          value = user.email || "";
          break;
        case "Marital Status (Marital Status Legend)":
          value = user.info?.maritalStatusLegend || "";
          break;
        case "Office Phone No":
          value = user.phoneNumber || "";
          break;
        case "GSM No":
          value = user.phoneNumber || "";
          break;
        case "Office Address 1":
          value = user.addressOfResidence || "";
          break;
        case "Office Address 2":
          value = user.addressOfResidence || "";
          break;
        case "City (City Legend)":
          value = user.info?.cityLagend || "";
          break;
        case "State (State Legend)":
          value = user.info?.stateLegend || "";
          break;
        case "Requesting Branch Code":
          value = user.info?.requestingBranch || "";
          break;
        case "Name on Card":
          value = `${user.firstName} ${user.lastName}` || "";
          break;
        case "ID Card Type (ID Card Type Legend)":
          value = "02";
          break;
        case "ID No":
          value = user.nin || "";
          break;
        case "ID Issue Date (dd/mm/yyyy)":
          value = user.info?.idIssueDate || "";
          break;
        case "ID Expiry Date(dd/mm/yyyy)":
          value = user.info?.idExpiryDate || "";
          break;
        case "Socio Prof Code (Socio Prof Code Legend)":
          value = user.info?.socioProCode || "";
          break;
        case "Product Code (Product Code Legend)":
          value = user.info?.productCodeLegend || "";
          break;
        case "Date of Birth (dd/mm/yyyy)":
          value = formatDate(user.info?.dob) || "";
          break;
        case "Title (Title Code Legend)":
          value = user.info?.titleLegend || "";
          break;
        case "Nationality (Nationality Code Legend)":
          value = "566";
          break;
        case "Company Name":
          value = "Omo Offa Nimi";
          break;
        case "OONM Unique ID":
          value = user.offaNimiId || "";
          break;
        default:
          value = "";
      }

      return value ?? "";
    });
  });

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Users");

  XLSX.writeFile(
    workbook,
    `approved_users_${new Date().toISOString().split("T")[0]}.xlsx`
  );
};

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
