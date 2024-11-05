const INITIAL_BRUSH_COLOR = HslColor(0, 0, 0);
const INITIAL_PIXEL_COLOR = HslColor(0, 100, 100);

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

function HslColor(hue, saturation, lightness, alpha = 100) {
  const hslColor = {
    hue,
    saturation,
    lightness,
    alpha,
    toString: function() {
      if (alpha === 100) {
        return `hsl(${this.hue} ${this.saturation}% ${this.lightness}%)`
      }

      return `hsl(${this.hue} ${this.saturation}% ${this.lightness}% / ${this.alpha}%)`
    }
  };

  return hslColor;
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
  const pixelColor = parseRgbToHsl(pixel.style['background-color']);
  if(brush.Erase) {
    updatePixelColor(pixel, INITIAL_PIXEL_COLOR);
  } else {
    const selectedColor = INITIAL_BRUSH_COLOR;
    const randomColor = brush.Mode === BrushModes.Random ? randomHsl() : updateLerp(brush);
    brush.Color = brush.Mode === BrushModes.Solid ? selectedColor : randomColor;
    updatePixelColor(pixel, mixColors(pixelColor, brush));
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
  element.style['background-color'] = color.toString();
}

function updateRainbowBrushColor(color) {
  const rainbowBrush = document.querySelector('#rainbow');
  rainbowBrush.style['background-color'] = color.toString();
}

function updateSolidBrushColor(color) {
  const solidBrush = document.querySelector('#solid');
  solidBrush.style['background-color'] = color.toString();
}

function parseHslString(hslString) {
  const [hue, saturation, lightness, alpha] = hslString.slice(4, -1).replaceAll('%', '').split(' ').filter(x => !isNaN(x));
  return HslColor(+hue, +saturation, +lightness, alpha ? +alpha : 100);
}


function randomHsl(saturation = 100, lightness = 50) {
  return HslColor(Math.floor(Math.random() * 360), saturation, lightness);
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

  const hueIncrement = (brush.ColorLerpTarget.hue - brush.ColorLerpInitial.hue) * brush.ColorLerpValue;
  brush.ColorLerpValue += 0.01;
  return HslColor((brush.ColorLerpInitial.hue + hueIncrement) % 360, 100, 50);
}


function mixColors(pixelColor, brush) {
  const color = HslColor(
    ((pixelColor.hue - (pixelColor.hue - brush.Color.hue) * brush.Alpha)) % 360,
    ((pixelColor.saturation - (pixelColor.saturation - brush.Color.saturation) * brush.Alpha)),
    ((pixelColor.lightness - (pixelColor.lightness - brush.Color.lightness) * brush.Alpha)),
    100
  );
  if (BrushSettings.Mode === BrushModes.Solid) console.log(color);
  return color;
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

function parseRgbToHsl(color) {
  color = formatRgb(color);
  const [red, green, blue] = color.map(rgbComponent => +(rgbComponent / 255));
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

  return HslColor(hue, saturation * 100, lightness * 100, alpha * 100);
}


updateSolidBrushColor(INITIAL_BRUSH_COLOR);
updateRainbowBrushColor(BrushSettings.ColorLerpInitial);
populateGrid(16);