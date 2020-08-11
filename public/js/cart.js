function getCartItem() {
  const cart = JSON.parse(window.localStorage.getItem('cart'));
  if (!cart || cart.length == 0) {
    const h4 = document.createElement('h4');
    h4.setAttribute('style', 'margin-left:20px;');
    h4.innerHTML = '購物車空空的耶';
    document.getElementById('cart-list').appendChild(h4);
  } else {
    for (let i = 0; i < cart.length; i += 1) {
      createRow(cart[i]);
    }
  }
  updateTotalPrice();
  checkoutBtn();
}

function createRow(obj) {
  const cart_list = document.getElementById('cart-list');
  // Create <div class="row">
  const div_row = document.createElement('div');
  div_row.setAttribute('class', 'row');
  div_row.setAttribute('item_id', obj.id);
  div_row.setAttribute('color', obj.color.name);
  div_row.setAttribute('size', obj.size);
  // Create <div class="variant">
  const div_variant = document.createElement('div');
  div_variant.setAttribute('class', 'variant');
  // Create <div class="picture">
  const div_picture = document.createElement('div');
  div_picture.setAttribute('class', 'picture');
  // Create <img src=...>
  const img = document.createElement('img');
  img.setAttribute('src', obj.main_image);
  div_picture.appendChild(img);
  div_variant.appendChild(div_picture);
  // Create <div class="details">
  const div_details = document.createElement('div');
  div_details.setAttribute('class', 'details');
  div_details.innerHTML = `${obj.name}<br>${obj.id}<br><br>顏色：${obj.color.name}<br>尺寸：${obj.size}`;
  div_variant.appendChild(div_details);
  div_row.appendChild(div_variant);

  // Create <div class="qty">
  const div_qty = document.createElement('div');
  div_qty.setAttribute('class', 'qty');
  // Create <select>
  const select = document.createElement('select');
  select.setAttribute('onchange', 'changeQty(this)');
  for (let i = 1; i <= obj.stock; i += 1) {
    // Create <option value=..>
    const option = document.createElement('option');
    option.setAttribute('value', i);
    option.innerHTML = i;
    if (i == obj.qty) {
      option.setAttribute('selected', '');
    }
    select.appendChild(option);
  }
  div_qty.appendChild(select);
  div_row.appendChild(div_qty);

  // Create <div class="price">
  const div_price = document.createElement('div');
  div_price.setAttribute('class', 'price');
  div_price.innerHTML = `NT. ${obj.price}`;
  div_row.appendChild(div_price);

  // Create <div class="subtotal">
  const div_subtotal = document.createElement('div');
  div_subtotal.setAttribute('class', 'subtotal');
  div_subtotal.innerHTML = `NT. ${obj.price * obj.qty}`;
  div_row.appendChild(div_subtotal);

  // Create <div class="remove">
  const div_remove = document.createElement('div');
  div_remove.setAttribute('class', 'remove');
  div_remove.setAttribute('onclick', 'clickRemove()');
  // Create <img src=...>
  const img_remove = document.createElement('img');
  img_remove.setAttribute('src', 'imgs/cart-remove.png');
  div_remove.appendChild(img_remove);
  div_row.appendChild(div_remove);

  cart_list.appendChild(div_row);
}

function checkoutBtn() {
  const cart = JSON.parse(window.localStorage.getItem('cart'));
  const checkout_btn = document.getElementById('checkout');
  if (!cart || cart.length == 0) {
    checkout_btn.setAttribute('class', 'disabled');
    checkout_btn.removeAttribute('onclick');
    checkout_btn.addEventListener('click', () => {
      alert('請選購商品');
    });
  } else {
    checkout_btn.removeAttribute('class');
    checkout_btn.removeAttribute('onclick');
    checkout_btn.setAttribute('onclick', 'checkout()');
  }
}

function updateTotalPrice() {
  const sub_total = document.getElementsByClassName('subtotal');
  let sum = 0;
  const confirm_subtotal = document.getElementById('subtotal');
  const confirm_freight = document.getElementById('freight');
  const confirm_total = document.getElementById('total');
  for (let i = 1; i < sub_total.length; i += 1) {
    sum += parseInt(sub_total[i].innerHTML.substr(3));
  }
  confirm_subtotal.innerHTML = sum;
  if (sum > 1500) {
    confirm_freight.innerHTML = 0;
  } else {
    confirm_freight.innerHTML = 60;
  }
  confirm_total.innerHTML = sum + parseInt(confirm_freight.innerHTML);
}

function updateCartItem() {
  const cart = JSON.parse(window.localStorage.getItem('cart'));
  if (!cart || cart.length == 0) {
    const h4 = document.createElement('h4');
    h4.setAttribute('style', 'margin-left:20px;');
    h4.innerHTML = '購物車空空的耶';
    document.getElementById('cart-list').appendChild(h4);
  }
}

function changeQty(obj) {
  const sub_total = event.target.parentElement.parentElement.getElementsByClassName('subtotal')[0];
  const price = event.target.parentElement.parentElement.getElementsByClassName('price')[0];
  const { value } = obj;
  sub_total.innerHTML = `NT. ${parseInt(price.innerHTML.substr(3)) * value}`;
  // Update localstorage
  const row = event.target.parentElement.parentElement;
  const id = row.getAttribute('item_id');
  const color = row.getAttribute('color');
  const size = row.getAttribute('size');
  const cart = JSON.parse(window.localStorage.getItem('cart'));
  const item = cart.find((item) => item.id === id && item.size === size && item.color.name === color);
  item.qty = value;
  window.localStorage.setItem('cart', JSON.stringify(cart));
  updateTotalPrice();
}

function clickRemove() {
  const row = event.target.parentElement.parentElement;
  const id = row.getAttribute('item_id');
  const color = row.getAttribute('color');
  const size = row.getAttribute('size');
  // Update localstorage
  const cart = JSON.parse(window.localStorage.getItem('cart'));
  const remove_item_index = cart.findIndex((item) => item.id === id && item.size === size && item.color.name === color);
  cart.splice(remove_item_index, 1);
  window.localStorage.setItem('cart', JSON.stringify(cart));
  row.remove();
  updateTotalPrice();
  updateCartItem();
  showCartNumber();
  checkoutBtn();
  alert('已從購物車中移除');
}

const order = {};
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
  // Create order_list
  order.list = JSON.parse(window.localStorage.getItem('cart'));

  // Remove order_list.stock
  for (let i = 0; i < order.list.length; i += 1) {
    delete order.list[i].stock;
  }

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
    window.localStorage.removeItem('cart');
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

// Cart Number
function showCartNumber() {
  const cart = JSON.parse(window.localStorage.getItem('cart'));
  if (!cart || cart.length == 0) {
    document.getElementById('cart-qty').innerHTML = 0;
  } else {
    document.getElementById('cart-qty').innerHTML = cart.length;
  }
}
