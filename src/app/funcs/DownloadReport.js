export const downloadCSV = (reportData) => {
  if (!reportData || reportData.length === 0) {
    alert("No data to download.");
    return;
  }

  // Extract keys for CSV header
  const keys = Object.keys(reportData[0]);

  // Create CSV content
  const csvData = [
    keys.join(","), // CSV header
    ...reportData.map((row) =>
      keys
        .map((key) => {
          // Handle potential null or undefined values
          let value = row[key];
          if (value === null || value === undefined) {
            value = ""; // Or handle as you see fit, e.g., 'N/A'
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

  // Define the required headers
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
    "Religion",
    "Sex",
  ];

  // Generate dummy data for Religion and Sex
  const religions = ["Christianity", "Islam", "Traditional", "Other"];
  const sexes = ["Male", "Female"];

  // Create CSV content with the specified headers
  const csvData = [
    headers.join(","), // CSV header
    ...selectedUsers.map((user) => {
      // Generate random dummy data for Religion and Sex
      const randomReligion =
        religions[Math.floor(Math.random() * religions.length)];
      const randomSex = sexes[Math.floor(Math.random() * sexes.length)];

      return headers
        .map((header) => {
          let value;

          switch (header) {
            case "Religion":
              value = randomReligion;
              break;
            case "Sex":
              value = randomSex;
              break;
            case "issuedDate":
              // Use current date as issued date (date of CSV download)
              value = new Date().toISOString().split("T")[0];
              break;
            default:
              value = user[header] || "";
          }

          // Handle potential null or undefined values
          if (value === null || value === undefined) {
            value = "";
          }

          // Escape any commas within the data
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
