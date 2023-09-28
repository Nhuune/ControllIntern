const multer = require('multer');
const slugify = require('slugify');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const fullName = req.body.fullName;
        const email = req.body.email;
        const fileName = `${slugify(fullName)}_${slugify(email)}.pdf`;
        cb(null, fileName);
    }
});

const checkFileExtension = (file) => {
    const fileExtension = file.originalname.split('.').pop();

    if (fileExtension.toLowerCase() === 'pdf') {
        return true;
    }

    return false;
};

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully');
        }
    });
};

const upload = multer({ storage: storage }).single('pdf');

module.exports = { checkFileExtension, deleteFile,  upload }