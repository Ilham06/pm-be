import { diskStorage } from 'multer';
import { extname } from 'path';

// Fungsi untuk menentukan penyimpanan file
export const storageConfig = diskStorage({
  destination: './uploads',  // Tentukan direktori penyimpanan file
  filename: (req, file, callback) => {
    // Generate nama file yang unik
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    callback(null, `${file.filename}-${uniqueSuffix}${ext}`);
  }
});

// Fungsi untuk memfilter file yang diterima (opsional)
export const fileFilter = (req, file, callback) => {
   const allowedTypes = /\.(pdf|doc|docx|xls|xlsx)$/;  // Filter untuk PDF, Word, dan Excel
 
   if (!file.originalname.match(allowedTypes)) {
     return callback(new Error('Only .pdf, .doc, .docx, .xls, and .xlsx files are allowed!'), false);
   }
   callback(null, true);  // Jika file sesuai, lanjutkan upload
 };

// Fungsi lain yang mungkin berguna, misalnya validasi ukuran file, dll.
export const limits = {
  fileSize: 5 * 1024 * 1024,  // Maksimum ukuran file 5MB
};
