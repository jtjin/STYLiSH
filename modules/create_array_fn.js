require('dotenv').config('../');

const { IP } = process.env;

// Create Array for String
function createArray(...params) {
  return JSON.stringify(params);
}

// Create Colors Array
function createColorsArray(code, name) {
  const colorsArr = [];
  if (typeof (code) === 'string') {
    const colorsObj = {};
    colorsObj.code = code;
    colorsObj.name = name;
    colorsArr.push(colorsObj);
  } else {
    for (let i = 0; i < code.length; i += 1) {
      const colorsObj = {};
      colorsObj.code = code[i];
      colorsObj.name = name[i];
      colorsArr.push(colorsObj);
    }
  }
  const newColorsArr = [...new Set(colorsArr.map((item) => JSON.stringify(item)))].map((item) => JSON.parse(item));
  return JSON.stringify(newColorsArr);
}

// Create Variants Array
function createVariantsArray(code, size, stock) {
  const variantsArr = [];
  if (typeof (code) === 'string') {
    const variantsObj = {};
    variantsObj.color_code = code;
    variantsObj.size = size;
    variantsObj.stock = stock;
    variantsArr.push(variantsObj);
  } else {
    for (let i = 0; i < code.length; i += 1) {
      const variantsObj = {};
      variantsObj.color_code = code[i];
      variantsObj.size = size[i];
      variantsObj.stock = stock[i];
      variantsArr.push(variantsObj);
    }
  }
  return JSON.stringify(variantsArr);
}

// Create imagesUrl Array
function createImagesUrlArray(images) {
  const imagesUrlArr = [];
  for (let i = 0; i < images.length; i += 1) {
    // const imagesUrl = IP + images[i].key;
    const imagesUrl = images[i].filename;
    imagesUrlArr.push(imagesUrl);
  }
  return JSON.stringify(imagesUrlArr);
}

module.exports = {
  createArray,
  createColorsArray,
  createVariantsArray,
  createImagesUrlArray,
};
