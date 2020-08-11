/* eslint-disable no-undef */

function Dashboard(data) {
  this.data = data;

  this.onlineUserCount = function () {
    const dom = document.getElementById('number');
    dom.innerHTML = `Total Revenue: ${data.totalRevenue}`;
  };

  this.drawProductsDivideByColor = function () {
    const colorData = [{
      values: data.productsDivideByColor.map((x) => x.count),
      labels: data.productsDivideByColor.map((x) => x.colorName),
      marker: {
        colors: data.productsDivideByColor.map((x) => {
          if (x.colorCode[0] != '#') {
            x.colorCode = `#${x.colorCode}`;
          }
          return x.colorCode;
        }),
      },
      type: 'pie',
    }];
    const layout = {
      title: {
        text: 'Product selled percentage in different colors',
      },
      height: 350,
    };
    Plotly.newPlot('pie', colorData, layout);
  };

  this.drawProductsInPriceRange = function () {
    const trace = {
      x: this.data.productsInPriceRange,
      type: 'histogram',
    };
    const layout = {
      title: {
        text: 'Product selled quantity in different price range',
      },
      xaxis: {
        title: {
          text: 'Price Range',
        },
      },
      yaxis: {
        title: {
          text: 'Quantity',
        },
      },
    };
    const data = [trace];
    Plotly.newPlot('histogram', data, layout);
  };

  this.drawTop5ProductsDividedBySize = function () {
    const sizeData = this.data.top5ProductsDividedBySize.map((d) => ({
      x: d.ids.map((id) => `product ${id}`),
      y: d.count,
      name: d.size,
      type: 'bar',
    }));

    const layout = {
      barmode: 'stack',
      title: {
        text: 'Quantity of top 5 selled products in different sizes',
      },
      yaxis: {
        title: {
          text: 'Quantity',
        },
      },
    };
    Plotly.newPlot('bar', sizeData, layout);
  };
}
