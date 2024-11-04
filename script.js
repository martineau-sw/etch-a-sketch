function createPixel(resolutionX, resolutionY) {
  const INITIAL_BRUSH_COLOR = 'hsl(0deg 0% 0% / 10%)';
  const INITIAL_PIXEL_COLOR = 'hsl(0deg 0% 100% / 100%)';
  const pixel = document.createElement('div');
  pixel.style['width'] = `${ 100 / resolutionX }%`;
  pixel.style['height'] = `${ 100 / resolutionY }%`;
  pixel.style['background-color'] = INITIAL_PIXEL_COLOR;
  pixel.addEventListener('mouseenter', event => {
    const pixel = event.target;
    const randomColor = randomColorHSL();
    const prevColor = pixel.style['background-color'];
    updateElementBackgroundColor(pixel, addColors(INITIAL_BRUSH_COLOR, prevColor));
    updateRainbowBrushBackgroundColor(randomColor);
  });
  return pixel;
}

function populateGrid(resolution) {
  const gridContainer = document.querySelector('#grid');
  for (let count = 0; count < resolution ** 2; count++) {
    gridContainer.appendChild(createPixel(resolution, resolution));
  }
}

function replaceGrid() {
  const gridContainer = document.querySelector('#grid');
  const newGridContainer = document.createElement('div');

  document.querySelector('body').insertBefore(newGridContainer, gridContainer);
  gridContainer.remove();
  newGridContainer.setAttribute('id', 'grid');
}

function updateElementBackgroundColor(element, color) {
  element.style['background-color'] = color;
}

function updateRainbowBrushBackgroundColor(color) {
  const brushButton = document.querySelector('#rainbow');
  brushButton.style['background-color'] = color;
}

function colorStringToArray(color) {
  const prefix = color.slice(0, 3);
  const [x, y, z, a] = color.slice(4, -1).split(' ').filter(x => !isNaN(x));
  return [prefix, x, y, z, a];
}

function arrayToColorString(array) {
  const [prefix, x, y, z, a] = array;
  if (prefix == 'rgb') {
    return `rgb(${x}% ${y}% ${z}% / ${a}%)`;
  } else if (prefix == 'hsl') {
    return `hsl(${x}deg ${y}% ${z}% / ${a}%)`;
  }
}

function randomColorHSL(saturation = 100, lightness = 50, opacity = 100) {
  return arrayToColorString(['hsl', Math.floor(Math.random() * 360), 100, 50, 100]);
}


function addColors(color0, color1) {
  color0 = colorStringToArray(color0);
  color1 = colorStringToArray(color1);

  if (color0.prefix !== color1.prefix) {
    console.error('Colors are not the same type');
    return;
  }

  const newColor = [color0.prefix];

  if (color0.prefix === 'rgb') {
    newColor[1] = Math.min(Math.floor(color0.r + color1.r), 100);
    newColor[2] = Math.min(Math.floor(color0.g + color1.g), 100);
    newColor[3] = Math.min(Math.floor(color0.b + color1.b), 100);
  } else if (color1.prefix === 'hsl') {
    newColor[1] = Math.floor((color0.h + color1.h) / 2);
  }

  newColor[4] = Math.min(Math.floor(color0.a + color1.a), 100);

  return arrayToColorString(newColor);
}

function multiplyColorStrings(color0, color1) {
  color0 = convertRGBAStringToArray(color0);
  color1 = convertRGBAStringToArray(color1);

  for (let i = 0; i < 3; i++) {
    let normalizedColor0 = color0[i] / 255;
    let normalizedColor1 = color1[i] / 255;
    
    color0[i] = Math.floor(normalizedColor0 * normalizedColor1 * 255);
  }

  if(color0[3] < 1) {
    if ((color0[3] + color1[3]) > 1) {
      color0[3] = 1;
    } else {
      color0[3] += color1[3];
    };
  }

  return convertArraytoRGBAString(color0);
}

function getUserResolution() {
  const resolution = prompt('Enter Resolution [8, 100]');
  const CANCELED_INPUT = '';
  if (Number.isNaN(resolution)) {
    if (resolution === CANCELED_INPUT) {
      return;
    }

    alert('Resolution must be a number');
    return;
  }

  if (!Number.isInteger(+resolution)) {
    alert("Resolution must be an integer");
    return;
  }

  if (+resolution < 8 || +resolution > 100) {
    alert("Resolution must be in range [8, 100]");
    return;
  }

  replaceGrid();
  populateGrid(+resolution);
}

populateGrid(16);