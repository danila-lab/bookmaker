import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: './front/public/uploads/',
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

export const deleteImg = (path) => {
    try {
        fs.unlinkSync('./front/public/' + path);
    } catch(error) {
        console.error('Error:', error);
    }
}

export default {
    upload,
    deleteImg,
}