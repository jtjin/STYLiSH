require('dotenv').config('../');
const express = require('express');

const router = express.Router();
const { IP } = process.env;

// Connecting to MySQL server
const mysql = require('../modules/mysql_connect');

// Connecting to Redis
const redis = require('../modules/redis_connect');

// Parses requests with JSON
router.use(express.json());
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

// Get createArray functions
const fn = require('../modules/create_array_fn');

// Get uploadImages functions
const { uploadS3 } = require('../modules/upload_images');

const upload_product_images = uploadS3.fields([{ name: 'main_image' }, { name: 'images' }]);
const upload_campaign_images = uploadS3.single('picture');

// POST at Product Management Page
router.post('/admin/product', upload_product_images, async (req, res, next) => {
  try {
    // check if product exist
    const product = await mysql.query('SELECT * FROM product WHERE id = ?', req.body.product_id);
    // If product exist
    if (product.length !== 0) {
      res.send('Product already exist.');
      return;
    }
    // If data not exist, add it into database
    // Create colorsArr
    const colorsArr = fn.createColorsArray(req.body.color_code, req.body.color_name);
    // Create sizesArr
    if (typeof (req.body.size) === 'string') {
      sizesArr = fn.createArray(req.body.size);
    } else {
      sizesArr = JSON.stringify(['S', 'M', 'L', 'XL', 'F']
        .filter((x) => new Set(req.body.size).has(x)));
    }
    // Create variantsArr
    const variantsArr = fn.createVariantsArray(req.body.color_code, req.body.size, req.body.stock);
    // Create mainImageUrl
    let mainImageUrl = '';
    if (req.files.main_image !== undefined) {
      mainImageUrl = IP + req.files.main_image[0].key;
    }
    // Create imagesUrlArr
    let imagesUrlArr = '';
    if (req.files.images !== undefined) {
      imagesUrlArr = fn.createImagesUrlArray(req.files.images);
    }
    // Add it into product table
    const addProduct = {
      id: req.body.product_id,
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      texture: req.body.texture,
      wash: req.body.wash,
      place: req.body.place,
      note: req.body.note,
      story: req.body.story,
      colors: colorsArr,
      sizes: sizesArr,
      variants: variantsArr,
      main_image: mainImageUrl,
      images: imagesUrlArr,
    };
    const result = await mysql.query('INSERT INTO product SET ?', addProduct);
    const { affectedRows } = result;
    res.send({ affectedRows });
  } catch (error) {
    next(error);
  }
});

// POST at Create Campaign Page
router.post('/admin/campaign', upload_campaign_images, async (req, res, next) => {
  try {
    // check if campaign exist
    const campaign = await mysql.query('SELECT * FROM campaign WHERE product_id = ?', req.body.product_id);
    // If campaign exist
    if (campaign.length !== 0) {
      res.send('Campagin already exist.');
      return;
    }
    // If campaign not exist, add it into database
    // Create pictureUrl
    let pictureUrl = '';
    if (req.file !== undefined) {
      pictureUrl = IP + req.file.key;
    }
    // Add it into campaign table
    const addCampaign = {
      product_id: req.body.product_id,
      picture: pictureUrl,
      story: req.body.story,
    };
    const result = await mysql.query('INSERT INTO campaign SET ?', addCampaign);
    const { affectedRows } = result;
    res.send({ affectedRows });
    // If redis is working, clear cache
    if (redis.client.ready) {
      await redis.del('campaign');
      console.log('Delete campaign cache successfully!');
    }
  } catch (error) {
    next(error);
  }
});

// midterm (Dashboard)
router.get('/admin/dashboard', async (req, res, next) => {
  try {
    // 2. Build the Dashboard
    const totalRevenue = await mysql.query('SELECT SUM(total) AS totalRevenue FROM order_table');
    const productsDivideByColor = await mysql.query('SELECT color_name AS colorName, color_code AS colorCode, SUM(qty) AS count FROM order_list GROUP BY color_name');
    const productsInPrice = await mysql.query('SELECT price, qty FROM order_list');
    const productsInPriceRange = productsInPrice.flatMap((product) => {
      const array = [];
      for (let i = 0; i < product.qty; i += 1) {
        array.push(product.price);
      }
      return array;
    });
    const top5Products = await mysql.query('SELECT product_id FROM order_list GROUP BY product_id ORDER BY SUM(qty) DESC LIMIT 5');
    const top5ProductsIds = top5Products.map((product) => product.product_id);
    const top5ProductsDetails = await mysql.query(
      `
      SELECT product_id, size, SUM(qty) AS count FROM order_list WHERE product_id = ? GROUP BY size
      UNION
      SELECT product_id, size, SUM(qty) AS count FROM order_list WHERE product_id = ? GROUP BY size
      UNION
      SELECT product_id, size, SUM(qty) AS count FROM order_list WHERE product_id = ? GROUP BY size
      UNION
      SELECT product_id, size, SUM(qty) AS count FROM order_list WHERE product_id = ? GROUP BY size
      UNION
      SELECT product_id, size, SUM(qty) AS count FROM order_list WHERE product_id = ? GROUP BY size
      `,
      top5ProductsIds,
    );
    const sizes = require('lodash').uniqBy(top5ProductsDetails, (item) => item.size)
      .flatMap((item) => [item.size]); // ['L', 'M', 'S']
    const top5ProductsDividedBySize = [];
    for (let i = 0; i < sizes.length; i += 1) {
      const count = top5ProductsDetails.filter((items) => items.size == sizes[i])
        .flatMap((item) => item.count);
      top5ProductsDividedBySize.push({ ids: top5ProductsIds, count, size: sizes[i] });
    }
    res.json(
      {
        totalRevenue: totalRevenue[0].totalRevenue,
        productsDivideByColor,
        productsInPriceRange,
        top5ProductsDividedBySize,
      },
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
