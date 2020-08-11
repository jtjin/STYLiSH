require('dotenv').config('../');
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

module.exports = { uploadS3 };
