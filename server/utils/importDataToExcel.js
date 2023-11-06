const ExcelJS = require("exceljs");

async function parseExcelToJson(buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1); // Assuming data is in the first worksheet

  let headers = {};
  let data = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      // Assuming the first row contains headers
      row.eachCell((cell, colNumber) => {
        headers[colNumber] = cell.value;
      });
    } else {
      let rowData = {};
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        rowData[headers[colNumber]] = cell.value;
      });
      data.push(rowData);
    }
  });

  return data;
}

module.exports = {
  parseExcelToJson,
};
