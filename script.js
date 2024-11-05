const INITIAL_BRUSH_COLOR = 'hsl(0 0% 0%)';
const INITIAL_PIXEL_COLOR = 'hsl(0 100% 100%)';

const BrushModes = {
  Solid: 0,
  Random: 1,
  SmoothRandom: 2
}

const BrushSettings = {
  Active: false,
  Erase: false,
  Mode: BrushModes.Solid,
  Alpha: 1,
  Color: INITIAL_BRUSH_COLOR,
  ColorLerpInitial: randomHsl(),
  ColorLerpTarget: randomHsl(),
  ColorLerpValue: 0
}

function createPixel(resolutionX, resolutionY) {
  const pixel = document.createElement('div');
  pixel.style['width'] = `${ 100 / resolutionX }%`;
  pixel.style['height'] = `${ 100 / resolutionY }%`;
  pixel.style['background-color'] = INITIAL_PIXEL_COLOR;
  pixel.addEventListener('mouseover', event => {
      if (!BrushSettings.Active) return;
      paintPixel(event.target, BrushSettings);
  });

  pixel.addEventListener('mousedown', event => {
    BrushSettings.Active = true;
    if (event.button === 2) BrushSettings.Erase = true;
  })

  pixel.addEventListener('mouseup', event => {
    BrushSettings.Active = false;
    BrushSettings.Erase = false;
  })

  pixel.addEventListener('click', event => {
    paintPixel(event.target, BrushSettings);
  })
  return pixel;
}

function paintPixel(pixel, brush) {
  const pixelColor = convertRgbToHsl(pixel.style['background-color']);
  if(brush.Erase) {
    updatePixelColor(pixel, INITIAL_PIXEL_COLOR);
  } else {
    const randomColor = brush.Mode === brush.Random ? randomHsl() : updateLerp(brush);
    brush.Color = brush.Mode === brush.Solid ? brush.Color : randomColor;
    updatePixelColor(pixel, addColors(pixelColor, brush));
    updateRainbowBrushColor(randomColor);
  }
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

function randomHsl(saturation = 100, lightness = 50) {
  return hslArrayToString(['hsl', Math.floor(Math.random() * 360), saturation, lightness]);
}

function setBrushMode(mode) {
  BrushSettings.Mode = mode;
}

function updateLerp(brush) {
  if (brush.ColorLerpValue >= 1) {
    brush.ColorLerpInitial = brush.ColorLerpTarget;
    brush.ColorLerpTarget = randomHsl();
    brush.ColorLerpValue = 0;
  }

  const colorInitialArray = hslStringToArray(brush.ColorLerpInitial);
  const colorTargetArray = hslStringToArray(brush.ColorLerpTarget);
  const hueIncrement = (colorTargetArray[0] - colorInitialArray[0]) * brush.ColorLerpValue;
  brush.ColorLerpValue += 0.01;
  const newHue = +colorInitialArray[0] + +hueIncrement
  return `hsl(${(newHue) % 360} 100% 50%)`;
}


function addColors(pixelColorString, brush) {
  const pixelColorArray = hslStringToArray(pixelColorString);
  const brushColorArray = hslStringToArray(brush.Color);
  const newColorArray = [
    ((pixelColorArray[0] - (pixelColorArray[0] - brushColorArray[0]) * brush.Alpha)) % 360,
    ((pixelColorArray[1] - (pixelColorArray[1] - brushColorArray[1]) * brush.Alpha)),
    ((pixelColorArray[2] - (pixelColorArray[2] - brushColorArray[2]) * brush.Alpha)),
    100
  ]

  return hslArrayToString(newColorArray);
}

function getUserResolution() {
  const resolution = prompt('Enter Resolution [8, 64]');
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

  if (+resolution < 8 || +resolution > 64) {
    alert("Resolution must be in range [8, 64]");
    return;
  }

  replaceGrid();
  populateGrid(+resolution);
}

function formatRgb(color) {
  if (color.slice(0, 4) === 'rgba') {
    return color.slice(5, -1).split(', ');
  }

  return color.slice(4, -1).split(', ');
}

function convertRgbToHsl(color) {
  color = formatRgb(color);
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
updateRainbowBrushColor(BrushSettings.ColorLerpInitial);
populateGrid(16);