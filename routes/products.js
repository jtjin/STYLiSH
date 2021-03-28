const express = require('express');

const router = express.Router();

// Connecting to MySQL server
const mysql = require('../modules/mysql_connect');

// Connecting to Redis
const redis = require('../modules/redis_connect');

// JSON Parse
function JSONParse(val) {
  if (val === '') {
    return '';
  }
  return JSON.parse(val);
}

// For all products ID
router.get('/allProductID', async (req, res, next) => {
  try {
    const result = await mysql.query('SELECT id FROM product', []);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

router.get('/products/:category', async (req, res, next) => {
  try {
    // Check paging & Get initial number for LIMIT
    const page = parseInt(req.query.paging);
    let init;
    if (Number.isInteger(page) && page >= 0) {
      init = page * 6;
    } else {
      init = 0;
    }
    // Create sql
    let sql;
    let queryArgs;
    switch (req.params.category) {
      case 'all':
        sql = 'SELECT * FROM product WHERE category != ?';
        queryArgs = [''];
        break;
      case 'men':
      case 'women':
      case 'accessories':
        sql = 'SELECT * FROM product WHERE category = ?';
        queryArgs = [req.params.category];
        break;
      case 'search':
        sql = 'SELECT * FROM product WHERE title LIKE ?';
        queryArgs = [`%${req.query.keyword}%`];
        break;
      case 'details':
        let cacheProduct;
        // Check product from cache
        if (redis.client.ready) {
          cacheProduct = await redis.get(`details_id=${req.query.id}`);
        }
        if (cacheProduct) {
          console.log('Get product from cache');
          res.json({ data: JSON.parse(cacheProduct) });
          return;
        }
        sql = 'SELECT * FROM product WHERE id = ?';
        queryArgs = [req.query.id];
        break;
      default:
        res.status(403).send({ error: 'Wrong Request' });
        return;
    }
    sql += ' ORDER BY id LIMIT ?, ?';
    queryArgs.push(init, init + 7);
    let products = await mysql.query(sql, queryArgs);
    if (products.length == 0) {
      if (req.params.category === 'details') {
        res.json({ data: null });
      } else {
        res.json({ data: [] });
      }
      return;
    }
    for (let i = 0; i < products.length; i += 1) {
      products[i].colors = JSONParse(products[i].colors);
      products[i].sizes = JSONParse(products[i].sizes);
      products[i].variants = JSONParse(products[i].variants);
      // Change Type of stock(string) to Number
      for (let j = 0; j < products[i].variants.length; j += 1) {
        products[i].variants[j].stock = parseInt(products[i].variants[j].stock);
      }
      products[i].images = JSONParse(products[i].images);
      for (let k = 0; k<products[i].images.length;k++) {
        products[i].images[k] = `/assets/${products[i].id}/${products[i].images[k]}`;
      }
      products[i].main_image = `/assets/${products[i].id}/${products[i].main_image}`;
    }

    if (req.params.category == 'details') {
      if (redis.client.ready) {
        await redis.set(`details_id=${req.query.id}`, JSON.stringify(products[0]));
      }
      res.json({ data: products[0] });
      return;
    }

    if (products.length < 7) {
      res.json({ data: products });
      return;
    }
    products = products.slice(0, 6);
    res.json({ data: products, next_paging: parseInt(page) + 1 || 1 });
    return;
  } catch (error) {
    next(error);
  }
});

module.exports = router;
