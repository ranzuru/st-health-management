import ExcelJS from "exceljs";

export const exportToExcel = async (data, headers, filenamePrefix) => {
  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // Define columns with headers and key (for mapping)
  const columns = headers.map((header) => ({ header, key: header }));

  // Set the columns in the worksheet
  worksheet.columns = columns;

  // Add rows to the worksheet
  data.forEach((record) => {
    const rowData = {};
    headers.forEach((header) => {
      rowData[header] = record[header];
    });
    worksheet.addRow(rowData);
  });

  // Auto-fit columns based on content
  worksheet.columns.forEach((column) => {
    let maxColumnLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 0;
      if (columnLength > maxColumnLength) {
        maxColumnLength = columnLength;
      }
    });
    column.width = maxColumnLength + 2; // Add some padding
  });

  // Generate a blob and create a download link
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filenamePrefix}_export_${Date.now()}.xlsx`;
  link.click();
};
