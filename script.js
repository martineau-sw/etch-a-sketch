const INITIAL_BRUSH_COLOR = 'hsl(0 0% 0%)';
const INITIAL_PIXEL_COLOR = 'hsl(0 100% 100%)';

let brushMode = 0;
let brushAlpha = 0.5;
let colorInitial = randomColorHSL(100, 50, 100);
let colorTarget = colorInitial;
let colorLerp = 0;

function createPixel(resolutionX, resolutionY) {
  const pixel = document.createElement('div');
  pixel.style['width'] = `${ 100 / resolutionX }%`;
  pixel.style['height'] = `${ 100 / resolutionY }%`;
  pixel.style['background-color'] = INITIAL_PIXEL_COLOR;
  pixel.addEventListener('mouseenter', event => {
    const pixel = event.target;
    const prevColor = convertRGBtoHSL(pixel.style['background-color']);
    let randomColor = updateLerp();
    if (brushMode === 0) {
      updatePixelColor(pixel, addColors(prevColor, INITIAL_BRUSH_COLOR));
    } else if (brushMode === 1) {
      updatePixelColor(pixel, addColors(prevColor, randomColor));
    }
    updateRainbowBrushColor(randomColor);
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

function updateRainbowBrushColor(color) {
  const rainbowBrush = document.querySelector('#rainbow');
  color = hslStringToArray(color);
  rainbowBrush.style['background-color'] = `hsl(${color[0]} 100% 50%)`;
}

function updateSolidBrushColor() {
  const solidBrush = document.querySelector('#black');
  solidBrush.style['background-color'] = INITIAL_BRUSH_COLOR;
}

function hslStringToArray(hslString) {
  const [h, s, l, a] = hslString.slice(4, -1).replaceAll('%', '').split(' ').filter(x => !isNaN(x));
  return [+h, +s, +l, +a];
}

function hslArrayToString(array) {
  return `hsl(${array[0]} ${array[1]}% ${array[2]}% / ${array[3]}%)`;
}

function randomColorHSL(saturation = 100, lightness = 50, opacity = 100) {
  return hslArrayToString(['hsl', Math.floor(Math.random() * 360), saturation, lightness, opacity]);
}

function setBrushMode(mode) {
  brushMode = mode;
}

function updateLerp() {
  if (colorLerp >= 1) {
    colorInitial = colorTarget;
    colorTarget = randomColorHSL(100, 50, 10);
    colorLerp = 0;
  }

  const colorInitialArray = hslStringToArray(colorInitial);
  const colorTargetArray = hslStringToArray(colorTarget);
  const hueIncrement = (colorTargetArray[0] - colorInitialArray[0]) * colorLerp;
  colorLerp += 0.01;
  const newHue = +colorInitialArray[0] + +hueIncrement
  return `hsl(${(newHue) % 360} 100% 50%)`;
}


function addColors(pixelColorString, brushColorString) {

  const pixelColorArray = hslStringToArray(pixelColorString);
  const brushColorArray = hslStringToArray(brushColorString);
  const newColorArray = [
    ((pixelColorArray[0] - (pixelColorArray[0] - brushColorArray[0]) * brushAlpha)) % 360,
    ((pixelColorArray[1] - (pixelColorArray[1] - brushColorArray[1]) * brushAlpha)),
    ((pixelColorArray[2] - (pixelColorArray[2] - brushColorArray[2]) * brushAlpha)),
    100
  ]

  return hslArrayToString(newColorArray);
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

function formatLegacyRGB(color) {
  if (color.slice(0, 4) === 'rgba') {
    return color.slice(5, -1).split(', ');
  }

  return color.slice(4, -1).split(', ');
}

function convertRGBtoHSL(color) {
  color = formatLegacyRGB(color);
  const red = +color[0] / 255;
  const green = +color[1] / 255;
  const blue = +color[2] / 255;
  const alpha = color.length === 3 ? 1 : +color[3];
  
  const rgbMin = Math.min(red, green, blue);
  const rgbMax = Math.max(red, green, blue);
  const rgbDelta = rgbMax - rgbMin;
  let hue = 0;
  if (rgbDelta !== 0) {
    switch (rgbMax) {
      case red: hue = ((green - blue) / rgbDelta) % 6; break;
      case green: hue = (blue - red) / rgbDelta + 2; break;
      case blue: hue = (red - green) / rgbDelta + 4; break;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) {
      hue += 360;
    }
  }

  const lightness = (rgbMax + rgbMin) / 2;
  const saturation = rgbDelta === 0 ? 0 : rgbDelta / (1 - Math.abs(2 * lightness - 1));
  const colorString = hslArrayToString([hue, saturation * 100, lightness * 100, alpha * 100]);

  return colorString;
}


updateSolidBrushColor();
updateRainbowBrushColor(colorInitial);
populateGrid(16);