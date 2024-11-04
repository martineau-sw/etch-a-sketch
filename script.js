let colorInitial = randomColorHSL(100, 50, 100);
let colorTarget = randomColorHSL(100, 50, 100);
let colorLerp = 0;

function createPixel(resolutionX, resolutionY) {
  const INITIAL_BRUSH_COLOR = 'hsl(0 100% 50% / 100%)';
  const INITIAL_PIXEL_COLOR = 'hsl(0 50% 100% / 100%)';
  const pixel = document.createElement('div');
  pixel.style['width'] = `${ 100 / resolutionX }%`;
  pixel.style['height'] = `${ 100 / resolutionY }%`;
  pixel.style['background-color'] = INITIAL_PIXEL_COLOR;
  pixel.addEventListener('mouseenter', event => {
    const pixel = event.target;
    const prevColor = pixel.style['background-color'];
    let randomColor = updateLerp();
    updateRainbowBrushBackgroundColor(randomColor);
    updatePixelColor(pixel, randomColor);
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

function updatePixelColor(element, color) {
  element.style['background-color'] = color;
}

function updateRainbowBrushBackgroundColor(color) {
  const brushButton = document.querySelector('#rainbow');
  brushButton.style['background-color'] = color;
}

function colorStringToArray(color) {
  const prefix = color.slice(0, 3);
  const [x, y, z, a] = color.slice(4, -1).replaceAll('%', '').split(' ').filter(x => !isNaN(x));
  return [prefix, x, y, z, a];
}

function arrayToColorString(array) {
  const [prefix, x, y, z, a] = array;
  if (prefix == 'rgb') {
    return `rgb(${x}% ${y}% ${z}% / ${a}%)`;
  } else if (prefix == 'hsl') {
    return `hsl(${x} ${y}% ${z}% / ${a}%)`;
  }
}

function randomColorHSL(saturation = 100, lightness = 50, opacity = 100) {
  return arrayToColorString(['hsl', Math.floor(Math.random() * 360), saturation, lightness, opacity]);
}

function updateLerp() {
  if (colorLerp >= 1) {
    colorInitial = colorTarget;
    colorTarget = randomColorHSL(100, 50, 100);
    colorLerp = 0;
  }

  const colorInitialArray = colorStringToArray(colorInitial);
  const colorTargetArray = colorStringToArray(colorTarget);
  const hueIncrement = (colorTargetArray[1] - colorInitialArray[1]) * colorLerp;
  colorLerp += 0.01;
  return addColors(colorInitial, `hsl(${hueIncrement} 100% 50% / 100%)`);
}


function addColors(color0, color1) {
  color0 = colorStringToArray(color0);
  color1 = colorStringToArray(color1);

  if (color0[0] !== color1[0]) {
    console.error('Colors are not the same type');
    return;
  }

  const newColor = color0;

  if (color0[0] === 'rgb') {
    newColor[0] = 'rgb';
    newColor[1] = Math.min(Math.floor(+color0[1] + +color1[1]), 100);
    newColor[2] = Math.min(Math.floor(+color0[2] + +color1[2]), 100);
    newColor[3] = Math.min(Math.floor(+color0[3] + +color1[3]), 100);
  } else if (color1[0] === 'hsl') {
    newColor[0] = 'hsl';
    newColor[1] = +color0[1] + +color1[1];
    console.log(color0, color1);
    newColor[2] = Math.floor((+color0[2] + +color1[2]) / 2);
    newColor[3] = Math.floor((+color0[3] + +color1[3]) / 2);
  }

  newColor[4] = Math.min(Math.floor(+color0[4] + +color1[4]), 100);

  console.log(newColor);
  return arrayToColorString(newColor);
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