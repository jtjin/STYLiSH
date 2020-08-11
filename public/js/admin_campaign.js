// Get all product ID
function getAllProductID(result) {
  const productList = document.getElementById('productID');
  if (result.data.length !== 0) {
    for (let i = 0; i < result.data.length; i += 1) {
      const opt = document.createElement('option');
      productList.appendChild(opt);
      opt.value = result.data[i].id;
      opt.innerHTML = result.data[i].id;
    }
  } else {
    const form = document.getElementById('form');
    const header = document.getElementById('header');
    form.remove();
    header.innerHTML = 'Oops, something went wrong!';
    throw Error('Cannot find product id');
  }
}

// Create ProductList
function createProductList() {
  fetch('/api/1.0/allProductID')
    .then((response) => response.json())
    .then(getAllProductID)
    .catch((err) => {
      console.log(err);
    });
}
