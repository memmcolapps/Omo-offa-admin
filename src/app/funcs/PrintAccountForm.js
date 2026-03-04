/**
 * Generates and prints Zenith Bank Individual Account Opening Forms
 * for selected approved users.
 */

const formatDate = (dateString) => {
  if (!dateString) return "";
  const parts = dateString.includes("-") ? dateString.split("-") : null;
  if (!parts || parts.length !== 3) return dateString;
  // If YYYY-MM-DD, convert to DD/MM/YYYY
  if (parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
};

const getValue = (user, path) => {
  const parts = path.split(".");
  let val = user;
  for (const p of parts) {
    val = val?.[p];
  }
  if (val === null || val === undefined || val === "") return "";
  return String(val).trim();
};

const renderFormRow = (label, value) => {
  if (!value) return "";
  return `
    <tr>
      <td class="label">${label}</td>
      <td class="value">${value}</td>
    </tr>
  `;
};

const renderFormRowDouble = (label1, value1, label2, value2) => {
  if (!value1 && !value2) return "";
  return `
    <tr>
      <td class="label">${label1}</td>
      <td class="value">${value1 || ""}</td>
      <td class="label">${label2}</td>
      <td class="value">${value2 || ""}</td>
    </tr>
  `;
};

const generateUserForm = (user, index, total) => {
  const title = getValue(user, "title");
  const surname = getValue(user, "lastName");
  const firstName = getValue(user, "firstName");
  const otherNames = getValue(user, "middleName");
  const mothersName = getValue(user, "info.mothersName");
  const dob = formatDate(getValue(user, "info.dob"));
  const gender = getValue(user, "info.sex");
  const placeOfBirth = getValue(user, "info.placeOfBirth");
  const stateOfOrigin = getValue(user, "stateOfResidence");
  const maritalStatus = getValue(user, "info.maritalStatus");
  const lga = getValue(user, "localGovernmentAreaOfResidence");
  const religion = getValue(user, "info.religion");
  const phone1 = getValue(user, "phoneNumber");
  const phone2 = getValue(user, "secondPhoneNumber");
  const email = getValue(user, "email");
  const address = getValue(user, "addressOfResidence");
  const state = getValue(user, "stateOfResidence");
  const city = getValue(user, "cityOfResidence");
  const nin = getValue(user, "nin");
  const bloodGroup = getValue(user, "info.bloodGroup");
  const genotype = getValue(user, "genotype");
  const offaNimiId = getValue(user, "offaNimiId");

  // Next of Kin
  const nokName = getValue(user, "emergencyContactName");
  const nokPhone = getValue(user, "emergencyContactNumber");

  // Employment
  const employmentStatus = getValue(user, "employmentStatus");
  const occupation = getValue(user, "occupation");

  // Father's info
  const fathersName = getValue(user, "info.fathersName");
  const fathersPlaceOfBirth = getValue(user, "info.fathersPlaceOfBirth");
  const fathersPhone = getValue(user, "info.fathersPhoneNumber");

  // Mother's info
  const mothersPlaceOfBirth = getValue(user, "info.mothersPlaceOfBirth");
  const mothersPhone = getValue(user, "info.mothersPhoneNumber");
  const mothersFatherName = getValue(user, "info.mothersFatherName");
  const mothersHomeTown = getValue(user, "info.mothersHomeTown");
  const mothersCompound = getValue(user, "info.mothersCompound");

  // Photo
  const profilePic = getValue(user, "profilePicUrl");

  // Compound / Ward
  const compound = getValue(user, "compoundName");
  const ward = getValue(user, "wardName");

  const pageBreak = index < total - 1 ? 'page-break-after: always;' : '';

  const hasParentInfo = fathersName || fathersPlaceOfBirth || fathersPhone || mothersPlaceOfBirth || mothersPhone || mothersFatherName || mothersHomeTown || mothersCompound;
  const hasNokInfo = nokName || nokPhone;
  const hasEmploymentInfo = employmentStatus || occupation;

  return `
    <div class="form-page" style="${pageBreak}">
      <!-- Header -->
      <div class="form-header">
        <div class="header-content">
          <h1>INDIVIDUAL ACCOUNT OPENING FORM</h1>
          <p class="subtitle">Zenith Bank Plc</p>
        </div>
      </div>

      <div class="meta-row">
        <span><strong>OffaNimi ID:</strong> ${offaNimiId}</span>
        <span><strong>User ${index + 1} of ${total}</strong></span>
      </div>

      <!-- Section 1: Personal Information -->
      <div class="section">
        <div class="section-header">1. PERSONAL INFORMATION</div>
        <table class="form-table">
          ${renderFormRowDouble("Title", title, "Surname", surname)}
          ${renderFormRowDouble("First Name", firstName, "Other Names", otherNames)}
          ${renderFormRow("Mother's Maiden Name", mothersName)}
          ${renderFormRowDouble("Date of Birth", dob, "Gender", gender)}
          ${renderFormRowDouble("Place of Birth", placeOfBirth, "Nationality", "Nigerian")}
          ${renderFormRowDouble("State of Origin", stateOfOrigin, "Marital Status", maritalStatus)}
          ${renderFormRowDouble("Local Govt. Area", lga, "Compound", compound)}
          ${renderFormRowDouble("Ward", ward, "Religion", religion)}
          ${renderFormRowDouble("Phone Number 1", phone1, "Phone Number 2", phone2)}
          ${renderFormRow("Email Address", email)}
          ${renderFormRow("Residential Address", address)}
          ${renderFormRowDouble("State", state, "City/Town", city)}
          ${renderFormRowDouble("LGA", lga, "", "")}
          ${renderFormRow("NIN", nin)}
          ${renderFormRowDouble("Blood Group", bloodGroup, "Genotype", genotype)}
        </table>
      </div>

      ${hasParentInfo ? `
      <!-- Parent Information -->
      <div class="section">
        <div class="section-header">PARENT INFORMATION</div>
        <table class="form-table">
          ${renderFormRowDouble("Father's Name", fathersName, "Father's Place of Birth", fathersPlaceOfBirth)}
          ${renderFormRow("Father's Phone Number", fathersPhone)}
          ${renderFormRowDouble("Mother's Name", mothersName, "Mother's Place of Birth", mothersPlaceOfBirth)}
          ${renderFormRowDouble("Mother's Phone Number", mothersPhone, "Mother's Father's Name", mothersFatherName)}
          ${renderFormRowDouble("Mother's Home Town", mothersHomeTown, "Mother's Compound", mothersCompound)}
        </table>
      </div>
      ` : ""}

      ${hasNokInfo ? `
      <!-- Section 2: Next of Kin -->
      <div class="section">
        <div class="section-header">2. DETAILS OF NEXT OF KIN</div>
        <table class="form-table">
          ${renderFormRowDouble("Name", nokName, "Phone Number", nokPhone)}
        </table>
      </div>
      ` : ""}

      ${hasEmploymentInfo ? `
      <!-- Section 3: Employment Details -->
      <div class="section">
        <div class="section-header">3. EMPLOYMENT DETAILS</div>
        <table class="form-table">
          ${renderFormRowDouble("Employment Status", employmentStatus, "Nature of Business / Occupation", occupation)}
        </table>
      </div>
      ` : ""}

      <!-- Passport Photo Section -->
      <div class="section">
        <div class="section-header">PASSPORT PHOTOGRAPH</div>
        <div class="photo-section">
          ${profilePic ? `<img src="${profilePic}" class="passport-photo" crossorigin="anonymous" />` : '<div class="photo-placeholder">Affix Passport Photograph Here</div>'}
          <div class="name-on-account">
            <strong>Name:</strong> ${surname} ${firstName} ${otherNames}
          </div>
        </div>
      </div>

      <!-- Declaration -->
      <div class="section">
        <div class="section-header">DECLARATION</div>
        <p class="declaration-text">
          I hereby apply for the opening of account(s) with Zenith Bank PLC. I understand that the information given herein and the documents supplied are the basis for opening such account(s) and I therefore warrant that such information is correct.
        </p>
        <div class="signature-area">
          <div class="sig-line">
            <div class="line"></div>
            <span>Signature</span>
          </div>
          <div class="sig-line">
            <div class="line"></div>
            <span>Date</span>
          </div>
        </div>
      </div>
    </div>
  `;
};

export const printAccountForms = (selectedUsers) => {
  if (!selectedUsers || selectedUsers.length === 0) {
    alert("No users selected for printing.");
    return;
  }

  const formsHtml = selectedUsers
    .map((user, i) => generateUserForm(user, i, selectedUsers.length))
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Account Opening Forms</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11px;
          color: #333;
          background: #fff;
        }
        .form-page {
          padding: 15px 20px;
          max-width: 210mm;
          margin: 0 auto;
        }
        .form-header {
          background: #c41230;
          color: white;
          padding: 10px 15px;
          margin-bottom: 8px;
        }
        .form-header h1 {
          font-size: 16px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .form-header .subtitle {
          font-size: 10px;
          margin-top: 2px;
        }
        .meta-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          margin-bottom: 8px;
          font-size: 10px;
          color: #666;
          border-bottom: 1px solid #ddd;
        }
        .section {
          margin-bottom: 10px;
          border: 1px solid #ccc;
        }
        .section-header {
          background: #7a7a7a;
          color: white;
          font-weight: bold;
          font-size: 10px;
          padding: 4px 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .form-table {
          width: 100%;
          border-collapse: collapse;
        }
        .form-table tr {
          border-bottom: 1px solid #e0e0e0;
        }
        .form-table tr:last-child {
          border-bottom: none;
        }
        .form-table td {
          padding: 4px 8px;
          vertical-align: top;
        }
        .form-table td.label {
          font-weight: bold;
          color: #555;
          width: 18%;
          font-size: 10px;
          background: #f9f9f9;
          white-space: nowrap;
        }
        .form-table td.value {
          width: 32%;
          font-size: 11px;
          color: #222;
          text-transform: uppercase;
        }
        .photo-section {
          padding: 10px;
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }
        .passport-photo {
          width: 120px;
          height: 140px;
          object-fit: cover;
          border: 2px solid #333;
        }
        .photo-placeholder {
          width: 120px;
          height: 140px;
          border: 2px dashed #999;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 10px;
          color: #999;
          padding: 5px;
        }
        .name-on-account {
          font-size: 12px;
          padding-top: 5px;
          text-transform: uppercase;
        }
        .declaration-text {
          padding: 8px;
          font-size: 10px;
          line-height: 1.4;
        }
        .signature-area {
          display: flex;
          justify-content: space-around;
          padding: 20px 15px 10px;
        }
        .sig-line {
          text-align: center;
        }
        .sig-line .line {
          width: 200px;
          border-bottom: 1px solid #333;
          margin-bottom: 4px;
          height: 30px;
        }
        .sig-line span {
          font-size: 10px;
          color: #555;
        }

        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .form-page {
            padding: 10px 15px;
          }
          .form-header {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .section-header {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .form-table td.label {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        @page {
          size: A4;
          margin: 10mm;
        }
      </style>
    </head>
    <body>
      ${formsHtml}
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to print forms.");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for images to load before printing
  const images = printWindow.document.querySelectorAll("img");
  if (images.length === 0) {
    printWindow.focus();
    printWindow.print();
  } else {
    let loaded = 0;
    const total = images.length;
    const onReady = () => {
      loaded++;
      if (loaded >= total) {
        printWindow.focus();
        printWindow.print();
      }
    };
    images.forEach((img) => {
      if (img.complete) {
        onReady();
      } else {
        img.addEventListener("load", onReady);
        img.addEventListener("error", onReady);
      }
    });
  }
};
