// Checkout modal
const modal = document.getElementById('myModal');
const checkout_btn = document.getElementById('checkout-btn');

// Get the close icon that closes the modal
const close_icon = document.getElementsByClassName('close')[0];

// When the user clicks the button, open the modal
checkout_btn.onclick = function () {
  const color_name = document.getElementsByClassName('color current')[0];
  const size = document.getElementsByClassName('size current')[0];
  const qty = document.getElementById('value');
  if (color_name && size && qty) {
    modal.style.display = 'block';
    getOrderList();
  } else {
    alert('請選購商品');
  }
};

// When the user clicks on close_icon(x), close the modal
close_icon.onclick = function () {
  modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal || event.target == modal_2) {
    modal.style.display = 'none';
    modal_2.style.display = 'none';
  }
};

const order = {};
function getOrderList() {
  const id = document.getElementById('product-id').innerHTML;
  const name = document.getElementById('product-name').innerHTML;
  const price = parseInt(document.getElementById('product-price').innerHTML.substr(4));
  const color_code = document.getElementsByClassName('color current')[0].getAttribute('value');
  const color_name = document.getElementsByClassName('color current')[0].getAttribute('color');
  const size = document.getElementsByClassName('size current')[0].innerHTML;
  const qty = parseInt(document.getElementById('value').innerHTML);
  const main_image = document.querySelector('#product-main-image img').getAttribute('src');

  // Create order_list
  order.list = {
    id,
    name,
    price,
    color: {
      code: color_code,
      name: color_name,
    },
    size,
    qty,
    main_image,
  };
  // Update subtotal
  const subtotal = document.getElementById('subtotal');
  subtotal.innerHTML = price * qty;
  // Update freight
  const freight = document.getElementById('freight');
  if (price * qty > 1500) {
    freight.innerHTML = 0;
  } else {
    freight.innerHTML = 60;
  }
  // Update total
  document.getElementById('total').innerHTML = parseInt(subtotal.innerHTML) + parseInt(freight.innerHTML);
}

function checkout() {
  // Check recipient
  const name = document.getElementById('recipient-name').value;
  if (!name) {
    alert('請輸入收件人姓名');
    return;
  }
  const email = document.getElementById('recipient-email').value;
  if (!email) {
    alert('請輸入 Email');
    return;
  }
  const phone = document.getElementById('recipient-phone').value;
  if (!phone) {
    alert('請輸入聯絡電話');
    return;
  }
  const address = document.getElementById('recipient-address').value;
  if (!address) {
    alert('請輸入收件地址');
    return;
  }
  const time = document.getElementsByName('recipient-time')[0].getAttribute('value');
  // Create order_recipient
  order.recipient = {
    name, phone, email, address, time,
  };

  const tappayStatus = TPDirect.card.getTappayFieldsStatus();
  // Check whether get Prime
  if (tappayStatus.canGetPrime === false) {
    alert('信用卡資訊填寫錯誤');
    return;
  }
  // Get prime
  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert(`get prime error ${result.msg}`);
      return;
    }
    order.prime = result.card.prime;
    order.shipping = 'delivery';
    order.payment = 'credit_card';
    order.subtotal = parseInt(document.getElementById('subtotal').innerHTML);
    order.freight = parseInt(document.getElementById('freight').innerHTML);
    order.total = parseInt(document.getElementById('total').innerHTML);
    postData('/api/1.0/order/checkout', order, render);
  });
}

function postData(url, data, cb) {
  return fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  })
    .then((res) => res.json())
    .then((result) => cb(result))
    .catch((err) => console.log(err));
}

function render(result) {
  if (result.error) {
    alert(`Transaction Failed: ${JSON.stringify(result.error)}`);
  } else {
    window.location.href = './thankyou.html';
  }
}

// TapPay
TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox');
TPDirect.card.setup({
  fields: {
    number: {
      // css selector
      element: '#card-number',
      placeholder: '1111 2222 3333 4444',
    },
    expirationDate: {
      // DOM object
      element: document.getElementById('card-expiration-date'),
      placeholder: 'MM / YY',
    },
    ccv: {
      element: '#card-ccv',
      placeholder: '123',
    },
  },
  styles: {
    // Styling ccv field
    'input.ccv': {
      'font-size': '16px',
    },
    // Styling expiration-date field
    'input.expiration-date': {
      'font-size': '16px',
    },
    // Styling card-number field
    'input.card-number': {
      'font-size': '16px',
    },
    // style focus state
    ':focus': {
      color: 'black',
    },
  },
});
