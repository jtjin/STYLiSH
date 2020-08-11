const nav_login = document.getElementById('nav_login');
const nav_signup = document.getElementById('nav_signup');
const login_form = document.getElementById('login_form');
const signup_form = document.getElementById('signup_form');
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const fbSignupBtn = document.getElementById('fb_signup_btn');
const fbLoginBtn = document.getElementById('fb_login_btn');

nav_login.addEventListener('click', () => {
  signup_form.style.display = 'none';
  login_form.style.display = 'block';
  nav_signup.style.background = 'none';
  nav_login.style.background = 'white';
  fbSignupBtn.style.display = 'none';
  fbLoginBtn.style.display = 'block';
});

nav_signup.addEventListener('click', () => {
  signup_form.style.display = 'block';
  login_form.style.display = 'none';
  nav_signup.style.background = 'white';
  nav_login.style.background = 'none';
  fbSignupBtn.style.display = 'block';
  fbLoginBtn.style.display = 'none';
});

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

// Signup Function
signupBtn.addEventListener('click', () => {
  event.preventDefault();
  const name = document.getElementById('signup_name').value;
  if (!name) {
    alert('Please enter your name');
    return;
  }
  const email = document.getElementById('signup_email').value;
  if (!email) {
    alert('Please enter your email');
    return;
  }
  const password = document.getElementById('signup_password').value;
  if (!password) {
    alert('Please enter your password');
    return;
  }
  const provider = 'native';
  const result = {
    name, email, password, provider,
  };
  postData('/api/1.0/user/signup', result, signupRender);
});
function signupRender(obj) {
  if (obj.error) {
    alert(obj.error);
  } else if (obj.data.access_token) {
    alert('Sign Up Complete! Please Log In!');
  } else {
    alert('Oops, something went wrong!');
  }
}

// Login function
loginBtn.addEventListener('click', () => {
  event.preventDefault();
  const email = document.getElementById('login_email').value;
  if (!email) {
    alert('Please enter your email');
    return;
  }
  const password = document.getElementById('login_password').value;
  if (!password) {
    alert('Please enter your password');
    return;
  }
  const provider = 'native';
  const result = { email, password, provider };
  postData('/api/1.0/user/login', result, loginRender);
});
function loginRender(obj) {
  if (obj.error) {
    alert(obj.error);
  } else if (obj.data.access_token) {
    localStorage.setItem('token', obj.data.access_token);
    window.location.href = './profile.html';
  } else {
    alert('Oops, something went wrong!');
  }
}

/* Integrate Facebook Login */
// Initialization
window.fbAsyncInit = function () {
  FB.init({
    appId: '606485106744129',
    cookie: true,
    xfbml: true,
    version: 'v7.0',
  });
  // Record data
  FB.AppEvents.logPageView();
};
// Load the Facebook Javascript SDK asynchronously
(function (d, s, id) {
  let js; const fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// FB Signup Function
function FB_signup() {
  FB.login((response) => {
    if (!response.status) {
      alert('Please try again');
    }
    const result = {
      id: response.authResponse.userID,
      provider: response.authResponse.graphDomain,
      access_token: response.authResponse.accessToken,
    };
    if (response.status === 'connected') {
      postData('/api/1.0/user/signup', result, signupRender);
    }
  }, { scope: 'email' });
}
// FB Login Function
function FB_login() {
  FB.login((response) => {
    if (response.status === 'connected') {
      FB.api('/me', 'GET', { fields: 'id, name, email, picture' }, (response) => {
        const result = {
          id: response.id,
          provider: 'facebook',
          name: response.name,
          email: response.email,
          picture: response.picture.data.url,
        };
        postData('/api/1.0/user/login', result, loginRender);
      });
    } else {
      alert('Please try again');
    }
  }, { scope: 'email' });
}

// Signup/Login modal
const modal_2 = document.getElementById('myModal_2');
const btn_2 = document.getElementById('myBtn_2');

// When the user clicks the button, open the modal
btn_2.onclick = function () {
  if (!localStorage.getItem('token')) {
    // Check if token is available
    modal_2.style.display = 'block';
  } else {
    window.location.href = './profile.html';
  }
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal_2) {
    modal_2.style.display = 'none';
  }
};
