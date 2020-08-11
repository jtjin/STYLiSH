function getProfile() {
  if (!localStorage.getItem('token')) {
    // Check if token is available
    alert('Invalid acess, please signup or login!');
    window.location.href = './';
  } else {
    const bearer = `Bearer ${localStorage.getItem('token')}`;
    fetch('/api/1.0/user/profile', {
      headers: {
        Authorization: bearer,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // Check if token correct
        if (result.error) {
          alert('Invalid acess, please signup or login!');
          localStorage.removeItem('token');
          window.location.href = './';
        }
        // Check if token expired
        const time = (Date.now() - parseInt(result.data.login_time)) / 1000;
        if (time <= 3600) {
          createProfile(result);
        } else {
          alert('Your token has expired, please login again!');
          localStorage.removeItem('token');
          window.location.href = './';
        }
      });
  }
}

function createProfile(obj) {
  // Create photo
  const img = document.createElement('img');
  img.setAttribute('src', obj.data.picture);
  document.getElementById('image').appendChild(img);
  // Create name
  const h2 = document.createElement('h2');
  h2.innerHTML = `Name：${obj.data.name}`;
  document.getElementById('name').appendChild(h2);
  // Create email
  const h3 = document.createElement('h3');
  h3.innerHTML = `Email：${obj.data.email}`;
  document.getElementById('email').appendChild(h3);
}

function logOut() {
  localStorage.removeItem('token');
  window.location.href = './';
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
