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
