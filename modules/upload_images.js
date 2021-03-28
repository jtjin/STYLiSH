require('dotenv').config('../');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_AWS_ACCESS_KEY,
  secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY,
});

const uploadS3 = multer({
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: process.env.S3_Bucket,
    metadata: (req, file, callBack) => {
      callBack(null, { fieldName: file.fieldname });
    },
    key: (req, file, callBack) => {
      const fullPath = `stylish/${req.body.product_id}/${file.originalname}`;
      callBack(null, fullPath);
    },
  }),
});

const upload = multer({
  storage: multer.diskStorage({
      destination: (req, file, cb) => {
          const productId = req.body.product_id;
          const imagePath = path.join(__dirname, `../public/assets/${productId}`);
          if (!fs.existsSync(imagePath)) {
              fs.mkdirSync(imagePath);
          }
          cb(null, imagePath);
      },
      filename: (req, file, cb) => {
          // const customFileName = crypto.randomBytes(18).toString('hex').substr(0, 8);
          // const fileExtension = file.mimetype.split('/')[1]; // get file extension from original file name
          // cb(null, customFileName + '.' + fileExtension);
          cb(null, file.originalname);
      }
  })
});

module.exports = { 
  uploadS3,
  upload,
 };
