function generateGrid(resolution) {
  const gridContainer = document.querySelector('#grid');
  for (let count = 0; count < resolution ** 2; count++) {
    const pixel = document.createElement('div');
    pixel.style['width'] = `${ 100 / resolution }%`;
    pixel.style['height'] = `${ 100 / resolution }%`;
    pixel.addEventListener('mouseenter', event => {
      event.target.style['background-color'] = 'black';
    });
    gridContainer.appendChild(pixel);
  }
}

generateGrid(16);