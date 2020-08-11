const express = require('express');

const router = express.Router();

// Connecting to MySQL server
const mysql = require('../modules/mysql_connect');

// Parses requests with JSON
router.use(express.json());
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));

// get node-fetch
const fetch = require('node-fetch');

function createArray(...params) {
  return JSON.stringify(params);
}

function getTodayDate() {
  const fullDate = new Date();
  const yyyy = fullDate.getFullYear();
  const MM = (fullDate.getMonth() + 1) >= 10 ? (fullDate.getMonth() + 1) : (`0${fullDate.getMonth() + 1}`);
  const dd = fullDate.getDate() < 10 ? (`0${fullDate.getDate()}`) : fullDate.getDate();
  const today = yyyy + MM + dd;
  return today;
}

router.post('/order/checkout', async (req, res, next) => {
  try {
    const orderList = {
      order_number: getTodayDate() + Math.round(Math.random() * 10000),
      prime: req.body.prime,
      shipping: req.body.shipping,
      payment: req.body.payment,
      subtotal: parseInt(req.body.subtotal),
      freight: parseInt(req.body.freight),
      total: parseInt(req.body.total),
      recipient: createArray(req.body.recipient),
      status: 'unpaid',
    };
    // Check req.body.list is array & Add order_number
    let list = [];
    if (Array.isArray(req.body.list)) {
      for (let i = 0; i < req.body.list.length; i += 1) {
        req.body.list[i].order_number = orderList.order_number;
      }
      list = JSON.stringify(req.body.list);
    } else {
      req.body.list.order_number = orderList.order_number;
      list = createArray(req.body.list);
    }

    list = JSON.parse(list).map((items) => [items.id, items.name, items.price, items.color.code, items.color.name, items.size, items.qty, items.main_image, items.order_number]);
    // Create an unpaid order record in the database
    await mysql.query('INSERT INTO order_table SET ?', orderList);
    await mysql.query('INSERT INTO order_list(product_id, name, price, color_code, color_name, size, qty, main_image, order_number) VALUES ?', [list]);
    // Send data to TapPay server for payment processing
    const data = {
      prime: req.body.prime,
      partner_key: 'partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG',
      merchant_id: 'AppWorksSchool_CTBC',
      details: 'Clothes',
      amount: parseInt(req.body.total),
      cardholder: {
        phone_number: req.body.recipient.phone,
        name: req.body.recipient.name,
        email: req.body.recipient.email,
      },
      remember: false,
    };
    fetch('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime', {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
        'x-api-key': 'partner_PHgswvYEk4QY6oy3n8X3CwiQCVQmv91ZcFoD5VrkGFXo8N7BFiLUxzeG',
      },
      method: 'POST',
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.status == 0) {
          // Payment successful, update existed unpaid order record
          await mysql.query('UPDATE order_table SET status = ? WHERE prime = ? ', ['paid', req.body.prime]);
          res.send({ data: { number: orderList.order_number } });
        } else {
          // Otherwise, send payment error message
          res.send({ error: data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    next(error);
  }
});

router.get('/order/payments', async (req, res, next) => {
  try {
    const result = await mysql.query('SELECT user_id, total FROM order_table ORDER BY user_id', []);
    const new_result = result.reduce((arr, { user_id, total }) => {
      const id = arr.find((obj) => obj.user_id === user_id);
      if (id) {
        id.total_payment += total;
      } else {
        arr.push({ user_id, total_payment: total });
      }
      return arr;
    }, []);
    res.send({ data: new_result });
  } catch (error) {
    next(error);
  }
});

router.get('/order/payments_RDS', async (req, res, next) => {
  try {
    const result = await mysql.query('SELECT user_id, SUM(total) AS "total_payment" FROM order_table GROUP BY user_id ORDER BY user_id', []);
    res.send({ data: result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
