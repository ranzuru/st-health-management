const ExcelJS = require("exceljs");

exports.exportDataToExcel = async (data, headers) => {
  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Define columns with headers and key (for mapping)
  worksheet.columns = headers.map((header) => ({
    header: header.title,
    key: header.key,
    style: header.style || {},
  }));

  // Add rows to the worksheet
  data.forEach((record) => {
    worksheet.addRow(record);
  });

  // Auto-fit columns based on content
  worksheet.columns.forEach((column) => {
    let maxColumnLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      let columnLength = cell.value ? cell.value.toString().length : 0;
      if (columnLength > maxColumnLength) {
        maxColumnLength = columnLength;
      }
    });
    column.width = maxColumnLength < 10 ? 10 : maxColumnLength + 2; // Ensure a minimum width and add some padding
  });

  // Get the Excel file as a buffer
  return workbook.xlsx.writeBuffer();
};
