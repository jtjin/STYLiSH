/* Campaign */
fetch('api/1.0/marketing/campaigns')
  .then((res) => res.json())
  .then((data) => {
    createCampaigns(data);
    const img = document.getElementById('img').getElementsByTagName('a');
    const step = document.getElementById('step').getElementsByTagName('a');
    const index = { num: 0 };
    // Start up
    init();
    let show = setInterval(() => {
      next(index);
    }, 5000);
    // Click
    for (let i = 0; i < step.length; i += 1) {
      step[i].addEventListener('click', () => {
        clickStep();
      });
    }
    function clickStep() {
      const stepArr = [...step];
      const target = event.currentTarget;
      const target_index = stepArr.indexOf(target);
      for (let i = 0; i < stepArr.length; i += 1) {
        if (i == target_index) {
          step[i].id = 'current_step';
          img[i].id = 'current_img';
        } else {
          step[i].id = '';
          img[i].id = '';
        }
      }
      clearInterval(show);
      const new_index = { num: target_index };
      show = setInterval(() => next(new_index), 5000);
    }
    // Initial picture
    function init() {
      img[0].id = 'current_img';
      step[0].id = 'current_step';
    }
    // Next picture
    function next(obj) {
      if (obj.num < step.length - 1) {
        obj.num += 1;
      } else {
        obj.num = 0;
      }
      moveID(img, 'current_img', obj.num);
      moveID(step, 'current_step', obj.num);
    }
    // Move id
    function moveID(arr, id, num) {
      for (let i = 0; i < arr.length; i += 1) {
        if (arr[i].id == id) {
          arr[i].id = '';
        }
      }
      arr[num].id = id;
    }
  });

function createCampaigns(obj) {
  // Create <div id="img">
  const key_visual = document.getElementById('key_visual');
  const step = document.getElementById('step');
  const div_img = document.createElement('div');
  div_img.setAttribute('id', 'img');
  key_visual.insertBefore(div_img, step);

  for (let i = 0; i < obj.data.length; i += 1) {
    // Create <a class="visual" href="..." style = 'background-image: url(...);'>
    const a_visual = document.createElement('a');
    a_visual.setAttribute('class', 'visual');
    a_visual.setAttribute('href', `./product.html?id=${obj.data[i].product_id}`);
    a_visual.setAttribute('style', `background-image: url('${obj.data[i].picture}')`);
    div_img.appendChild(a_visual);
    // Create <div class="story">
    const story = obj.data[i].story.split(' ');
    let new_story = '';
    for (let i = 0; i < story.length; i += 1) {
      new_story += `${story[i]}<br>`;
    }
    const div_story = document.createElement('div');
    div_story.setAttribute('class', 'story');
    div_story.innerHTML = new_story;
    a_visual.appendChild(div_story);
    // Create <a class="circle">
    const a_circle = document.createElement('a');
    a_circle.setAttribute('class', 'circle');
    step.appendChild(a_circle);
  }
}

/* Product */
const product = {};
function getAllProducts() {
  if (window.location.search.substr(1, 3) == 'tag') {
    const tag = window.location.search.substr(5);
    switch (tag) {
      case 'men':
        getData('/api/1.0/products/men?paging=0');
        // Select men category
        document.getElementById('men').classList.add('current');
        break;
      case 'women':
        getData('/api/1.0/products/women?paging=0');
        // Select women category
        document.getElementById('women').classList.add('current');
        break;
      case 'accessories':
        getData('/api/1.0/products/accessories?paging=0');
        // Select accessories category
        document.getElementById('accessories').classList.add('current');
        break;
      default:
        // For search
        getData(`/api/1.0/products/search?keyword=${tag}&paging=0`);
        break;
    }
  } else if (!window.location.search) {
    // For home page
    getData('/api/1.0/products/all?paging=0');
  } else {
    // For wrong parameter
    window.location.href = './';
  }
}

function getData(url) {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // If response the error or nothing
      if (data.error || data.data.length == 0) {
        if (window.location.href == `${window.location.origin}/`) {
          alert('很抱歉，目前還沒有商品耶');
        } else {
          alert('很抱歉，找不到符合的商品耶');
          window.location.href = './';
        }
      } else {
        createProducts(data);
      }
    })
    .catch((err) => console.log(err));
}

// Scroll to bottom, show more products
window.addEventListener('scroll', () => {
  // Height of scroll bar
  const scrollBarHeight = document.documentElement.scrollTop;
  // Height of whole page
  const pageHeight = document.documentElement.scrollHeight;
  // Height of browser view
  const viewHeight = document.documentElement.clientHeight;
  if (pageHeight - (scrollBarHeight + viewHeight) < 300) {
    if (product.next_paging && product.data) {
      const tag = window.location.search.substr(5);
      switch (tag) {
        case '':
          product.data = null; // Clear product.data
          getData(`/api/1.0/products/all?paging=${product.next_paging}`);
          break;
        case 'men':
          product.data = null; // Clear product.data
          getData(`/api/1.0/products/men?paging=${product.next_paging}`);
          break;
        case 'women':
          product.data = null; // Clear product.data
          getData(`/api/1.0/products/women?paging=${product.next_paging}`);
          break;
        case 'accessories':
          product.data = null; // Clear product.data
          getData(`/api/1.0/products/accessories?paging=${product.next_paging}`);
          break;
        default:
          // For search
          product.data = null; // Clear product.data
          getData(`/api/1.0/products/search?keyword=${tag}&paging=${product.next_paging}`);
          break;
      }
    }
  }
});

function createProducts(obj) {
  const products = document.getElementById('products');
  for (let i = 0; i < obj.data.length; i += 1) {
    // Create <a class='prdocut'>
    const a = document.createElement('a');
    a.setAttribute('class', 'product');
    a.setAttribute('href', `product.html?id=${obj.data[i].id}`);
    // Create <img>, <div clsas='colors'>
    const img = document.createElement('img');
    img.setAttribute('src', obj.data[i].main_image);
    a.appendChild(img);
    // Create <div clsas='colors'>
    const div_colors = document.createElement('div');
    div_colors.setAttribute('class', 'colors');
    a.appendChild(div_colors);
    for (let j = 0; j < obj.data[i].colors.length; j += 1) {
      // Create <div clsas='color'>
      const div_color = document.createElement('div');
      div_color.setAttribute('class', 'color');
      div_color.setAttribute('style', `background-color: #${obj.data[i].colors[j].code};`);
      div_colors.appendChild(div_color);
    }
    // Create <div clsas='name'>
    const div_name = document.createElement('div');
    div_name.setAttribute('class', 'name');
    div_name.innerHTML = obj.data[i].title;
    a.appendChild(div_name);
    // Create <div clsas='price'>
    const div_price = document.createElement('div');
    div_price.setAttribute('class', 'price');
    div_price.innerHTML = `TWD.${obj.data[i].price}`;
    a.appendChild(div_price);
    products.appendChild(a);
  }
  product.data = obj.data;
  product.next_paging = obj.next_paging;
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
