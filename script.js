function createPixel(resolutionX, resolutionY) {
  const INITIAL_BRUSH_COLOR = 'rgba(0,0,0,0.1)';
  const INITIAL_PIXEL_COLOR = 'rgba(0,0,0,0)';
  const pixel = document.createElement('div');
  pixel.style['width'] = `${ 100 / resolutionX }%`;
  pixel.style['height'] = `${ 100 / resolutionY }%`;
  pixel.style['background-color'] = INITIAL_PIXEL_COLOR;
  pixel.addEventListener('mouseenter', event => {
    const pixel = event.target;
    const prevColor = pixel.style['background-color'];
    updateElementBackgroundColor(pixel, addColorStrings(INITIAL_BRUSH_COLOR, prevColor));
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

function convertRGBAStringToArray(rgbaString) {
  return Array.from(rgbaString.slice(5, -1).split(','), element => +element);
}

function convertArraytoRGBAString(rgbaArray) {
  return `rgba(${rgbaArray.toString()})`
}

function addColorStrings(color0, color1) {
  color0 = convertRGBAStringToArray(color0);
  color1 = convertRGBAStringToArray(color1);

  for (let i = 0; i < 3; i++) {
    if (color0[i] < 255) {
      color0[i] += color1[i];
    }
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

convertRGBAStringToArray('rgb(0,0,0,1)');
populateGrid(16);