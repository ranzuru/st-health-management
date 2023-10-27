import * as XLSX from "xlsx";

// Export data to XLSX
export const exportToXLSX = (data, headers, filename) => {
  if (!data || !data.length) {
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, filename);
};

// Import data from XLSX
export const importFromXLSX = (file, callback) => {
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    const data = event.target.result;
    const workbook = XLSX.read(data, { type: "binary" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = parsedData[0];
    const jsonData = parsedData.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    if (validateData(jsonData)) {
      callback(jsonData);
    } else {
      console.error("Data validation failed.");
      // Optionally inform the user here
    }
  };
  reader.onerror = () => {
    console.error("Could not read file");
  };
  reader.readAsBinaryString(file);
};

// Data validation (modify as per your schema)
const validateData = (data) => {
  for (const row of data) {
    // Ensure all fields exist in the row
    if (
      !row.lrn ||
      !row.name ||
      !row.age ||
      !row.gender ||
      !row.grade ||
      !row.section ||
      !row.address ||
      !row.dateOfOnset ||
      !row.dateOfAdmission ||
      !row.hospitalAdmission ||
      !row.dateOfDischarge
    ) {
      console.error("Missing required fields in row:", row);
      return false;
    }

    if (typeof row.age !== "number" || row.age < 5 || row.age > 100) {
      console.error("Invalid age in row:", row);
      return false;
    }
  }
  return true;
};
