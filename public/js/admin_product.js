let row = 1;
const boxInput = document.getElementById('sales_box_input');

function createInput(type, name) {
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.id = 'new';
  input.required = 'required';
  if (name == 'color_code') {
    input.pattern = '[0-9a-fA-F]{6}';
    input.maxLength = '6';
    input.title = 'Hex Code #RRGGBB';
  } else if (name == 'size') {
    input.pattern = 'S|M|L|XL|F';
    input.title = 'S/M/L/XL/F';
  } else if (name == 'stock') {
    input.min = '0';
    input.max = '9999999';
  }
  return input;
}


function add() {
  event.preventDefault();
  const color_code = createInput('text', 'color_code');
  const color_name = createInput('text', 'color_name');
  const size = createInput('text', 'size');
  const stock = createInput('number', 'stock');

  boxInput.appendChild(color_code);
  boxInput.appendChild(color_name);
  boxInput.appendChild(size);
  boxInput.appendChild(stock);
  row += 1;
}

function remove() {
  event.preventDefault();
  if (row !== 1) {
    for (let i = 1; i <= 4; i += 1) {
      const { lastChild } = boxInput;
      boxInput.removeChild(lastChild);
    }
    row -= 1;
  }
}
