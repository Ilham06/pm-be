import * as ExcelJS from 'exceljs';

export const readExcelFile = async (file: Buffer): Promise<any[]> => {
   const workbook = new ExcelJS.Workbook();
   await workbook.xlsx.load(file.buffer); // Membaca file Excel dari buffer

   const worksheet = workbook.worksheets[0]; // Ambil sheet pertama

   // Iterasi melalui setiap baris dan konversi menjadi object
   const headers = [];
   const rows = [];
   worksheet.eachRow((row, rowNumber) => {
      const rowData = {};
      if (rowNumber == 1) {
         row.eachCell((cell, colNumber) => {
            headers.push(cell.value);
         });

      } else {
         row.eachCell((cell, colNumber) => {
            rowData[headers[colNumber - 1]] = cell.value;
         });
         rows.push(rowData);
      }


   });

   return rows;
};
