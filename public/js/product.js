let product = {};
function getProductId() {
  const id = window.location.search;
  if (!id) {
    window.location = './';
  } else {
    fetch(`/api/1.0/products/details${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data !== null && data.data !== undefined) {
          product = data;
          showProduct(data);
          const color = initCurrent(data);
          initDisabled(data, color);
        } else {
          window.location = './';
        }
      });
  }
}

// Show Product
function showProduct(obj) {
  // Select category
  const { category } = obj.data;
  const nav_item = document.getElementById(category);
  nav_item.classList.add('current');
  // Create main_img <img src=...>
  const img = document.createElement('img');
  img.setAttribute('src', obj.data.main_image);
  document.getElementById('product-main-image').appendChild(img);
  // Create name, id, price, story
  document.getElementById('product-name').innerHTML = obj.data.title;
  document.getElementById('product-id').innerHTML = obj.data.id;
  document.getElementById('product-price').innerHTML = `TWD.${obj.data.price}`;
  document.getElementById('product-story').innerHTML = obj.data.story;
  // Create colors <div class='color'>
  for (let i = 0; i < obj.data.colors.length; i += 1) {
    const div = document.createElement('div');
    div.setAttribute('class', 'color');
    div.setAttribute('value', obj.data.colors[i].code);
    div.setAttribute('color', obj.data.colors[i].name);
    div.setAttribute('onclick', 'clickColor()');
    div.setAttribute('style', `background-color: #${obj.data.colors[i].code};`);
    document.getElementById('product-colors').appendChild(div);
  }
  // Create sizes <div class='size'>
  for (let i = 0; i < obj.data.sizes.length; i += 1) {
    const div = document.createElement('div');
    div.setAttribute('class', 'size');
    div.setAttribute('onclick', 'clickSize()');
    div.innerText = obj.data.sizes[i];
    document.getElementById('product-sizes').appendChild(div);
  }
  // Create summary
  const description = obj.data.description.split(' ');
  let new_description = '';
  for (let i = 0; i < description.length; i += 1) {
    new_description += `${description[i]}<br>`;
  }
  const summary = `${obj.data.note}<br><br>${obj.data.texture}<br>${new_description}<br>清洗：${obj.data.wash}<br>產地：${obj.data.place}`;
  document.getElementById('product-summary').innerHTML = summary;
  // Create images <img src='...'>
  for (let i = 0; i < obj.data.images.length; i += 1) {
    const img = document.createElement('img');
    img.setAttribute('src', obj.data.images[i]);
    document.getElementById('product-images').appendChild(img);
  }
}

function hashMap(obj, color_code) {
  const hashMap = {};
  const variant = obj.data.variants;
  for (let i = 0; i < variant.length; i += 1) {
    if (variant[i].color_code == color_code) {
      hashMap[variant[i].size] = variant[i].stock;
    }
  }
  return hashMap;
}

// Initial
function initCurrent(obj) {
  const color = document.getElementById('product-colors').getElementsByTagName('div');
  const size = document.getElementById('product-sizes').getElementsByTagName('div');
  const value = document.getElementById('value');
  for (let i = 0; i < obj.data.colors.length; i += 1) {
    const size_stock = hashMap(obj, obj.data.colors[i].code);
    for (let j = 0; j < obj.data.sizes.length; j += 1) {
      if (size_stock[size[j].innerHTML] > 0) {
        color[i].classList.add('current');
        size[j].classList.add('current');
        value.innerHTML = 1;
        return obj.data.colors[i].code;
      }
    }
  }
}
function initDisabled(obj, color_code) {
  const size = document.getElementById('product-sizes').getElementsByTagName('div');
  const size_stock = hashMap(obj, color_code);
  for (let i = 0; i < obj.data.sizes.length; i += 1) {
    if (size_stock[size[i].innerHTML] == 0 || !size_stock[size[i].innerHTML]) {
      size[i].classList.add('disabled');
    }
  }
}

function clickAddCart() {
  // Get list
  const main_image = document.querySelector('#product-main-image img').getAttribute('src');
  const id = document.getElementById('product-id').innerHTML;
  const name = document.getElementById('product-name').innerHTML;
  const price = parseInt(document.getElementById('product-price').innerHTML.substr(4));
  const color_code = document.getElementsByClassName('color current')[0].getAttribute('value');
  const color_name = document.getElementsByClassName('color current')[0].getAttribute('color');
  const size = document.getElementsByClassName('size current')[0].innerHTML;
  const qty = parseInt(document.getElementById('value').innerHTML);
  const current_color = document.getElementsByClassName('color current');
  const current_size = document.getElementsByClassName('size current');
  const size_stock = hashMap(product, current_color[0].getAttribute('value'));
  const stock = parseInt(size_stock[current_size[0].innerHTML]);
  // Check if item duplicate
  const cart = JSON.parse(window.localStorage.getItem('cart')) || []; // String → Array
  const duplicate_item = cart.find((item) => item.id === id && item.size === size && item.color.name === color_name);
  if (duplicate_item) {
    duplicate_item.qty += qty;
    if (duplicate_item.qty > stock) {
      duplicate_item.qty = stock;
    }
    window.localStorage.setItem('cart', JSON.stringify(cart));
    alert('已加入購物車');
  } else {
    cart.push({
      id, name, price, color: { code: color_code, name: color_name }, size, qty, main_image, stock,
    });
    window.localStorage.setItem('cart', JSON.stringify(cart));
    alert('已加入購物車');
  }
  showCartNumber();
}

function clickColor() {
  // Change color class name
  const new_color = event.currentTarget;
  const old_color = document.getElementsByClassName('color current');
  old_color[0].classList.remove('current');
  new_color.classList.add('current');
  // Check sizes
  const size_stock = hashMap(product, new_color.getAttribute('value'));
  const size = document.getElementById('product-sizes').getElementsByTagName('div');
  const current_value = document.getElementById('value');
  current_value.innerHTML = 1;
  // Renew disable
  for (let i = 0; i < product.data.sizes.length; i += 1) {
    size[i].classList.remove('disabled');
    // Add disable for 0 stock
    if (size_stock[size[i].innerHTML] == 0 || !size_stock[size[i].innerHTML]) {
      size[i].classList.add('disabled');
    }
  }
  // If current_size stock = 0, change current
  const current_size = document.getElementsByClassName('size current');
  if (!current_size[0]) {
    for (let i = 0; i < product.data.sizes.length; i += 1) {
      if (size_stock[size[i].innerHTML] > 0) {
        size[i].classList.add('current');
        return;
      }
    }
  }
  if (size_stock[current_size[0].innerHTML] == 0 || !size_stock[current_size[0].innerHTML]) {
    current_size[0].classList.remove('current');
    for (let i = 0; i < product.data.sizes.length; i += 1) {
      if (size_stock[size[i].innerHTML] > 0) {
        size[i].classList.add('current');
        return;
      }
    }
  }
}

function clickSize() {
  const old_size = document.getElementsByClassName('size current');
  const new_size = event.currentTarget;
  const current_value = document.getElementById('value');
  if (new_size.classList.value != 'size disabled') {
    old_size[0].classList.remove('current');
    new_size.classList.add('current');
    current_value.innerHTML = 1;
  }
}

// Increase qty
function up() {
  const current_color = document.getElementsByClassName('color current');
  const current_size = document.getElementsByClassName('size current');
  const current_value = document.getElementById('value');
  const size_stock = hashMap(product, current_color[0].getAttribute('value'));
  let value = parseInt(current_value.innerHTML);
  const max_value = parseInt(size_stock[current_size[0].innerHTML]);
  if (value < max_value) {
    value += 1;
    current_value.innerHTML = value;
  }
}

// Decrease qty
function down() {
  const current_value = document.getElementById('value');
  let value = parseInt(current_value.innerHTML);
  if (value > 1) {
    value -= 1;
    current_value.innerHTML = value;
  }
}

// Cart Number
function showCartNumber() {
  const cart = JSON.parse(window.localStorage.getItem('cart'));
  if (!cart || cart.length == 0) {
    document.getElementById('cart-qty').innerHTML = 0;
  } else {
    document.getElementById('cart-qty').innerHTML = cart.length;
  }
}
