const colorPicker = document.querySelector('.color-picker');
const alphaPicker = document.querySelector('.alpha-picker');
const defaultColor = 'rgba(255, 255, 255, 1)';
let alpha = alphaPicker.value;
let selectedColor = hexToRGB(colorPicker.value);
let appliedColor;
let previousColor = defaultColor;
let clicked = false;
let drag = false;


const dragStart = () => {
    drag = true;
    alpha = alphaPicker.value;
    selectedColor = hexToRGB(colorPicker.value);
}

const dragEnd = () => {
    drag = false;
}

const mouseEnterCell = (event) => {
    previousColor = event.target.style['background-color'] == "" ? defaultColor : event.target.style['background-color'];

    if(drag) {
        appliedColor = colorCell(rgbToComponent(previousColor));
        event.target.style['background-color'] = appliedColor;
    }

}

const mouseUpCell = (event) => {
    event.target.style['background-color'] = appliedColor;
    clicked = true;
}

const mouseExitCell = (event) => {
    event.target.style['background-color'] = drag || clicked ? appliedColor : previousColor;
    clicked = false;
}

function rgbToComponent(rgbString) {
    rgbString = rgbString.includes('rgba(') ? rgbString.slice(5, -1) : rgbString.slice(4, -1);
    
    const array = rgbString.split(', ')

    array[3] = array[3] == undefined ? 1 : array[3];

    return array;
}

function hexToRGB(hexString) {
    hexString = hexString.slice(1);
    
    let array = [0, 0, 0, alpha];

    for(let i = 0; i < 4; i++) {
        array[i] = parseInt(hexString.substr(i * 2, 2).padStart(2, '0'), 16);
    }

    array[3] = alpha;

    hexString = `rgba(${array.join(', ')})`
    return hexString;
}

function colorCell(canvasColor) {
    let selected = rgbToComponent(selectedColor);

    if(selected[3] < 1) {
        return mixColor(canvasColor);
    }
    return replaceColor(canvasColor);
}

function mixColor(canvasColor) {
    let selected = rgbToComponent(selectedColor);

    for(let i = 0; i < 4; i++) {
        selected[i] = i == 3 ? +selected[i] + +canvasColor[i] / 2  : Math.floor((+selected[i] + +canvasColor[i]) / 2 );
    }

    return `rgba(${selected.join(', ')})`;
}

function replaceColor(canvasColor) {
    let selected = rgbToComponent(selectedColor)
    
    return `rgba(${selected.join(', ')})`;
}



const grid = (size) => {
    const root = document.querySelector('.grid');

    let cell;
    for(let x = 0; x < size; x++) {

        for(let y = 0; y < size; y++) {
            cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style['background-color'] = defaultColor;
            cell.style['grid-row-start'] = y
            cell.style['grid-row-start'] = y + 1;
            cell.style['grid-column-start'] = x
            cell.style['grid-column-start'] = x + 1;

            cell.addEventListener('mouseenter', mouseEnterCell);
            cell.addEventListener('mouseleave', mouseExitCell);
            cell.addEventListener('mouseup', mouseUpCell);
            colorPicker.addEventListener('change', (e) => {
                selectedColor = hexToRGB(e.target.value);
            });
            alphaPicker.addEventListener('change', (e) => {
                alpha = e.target.value;
            });
            root.appendChild(cell);
        }

    }

}

function replaceGrid(size) {
    const newGrid = document.querySelector('.grid');
    newGrid.childNodes.forEach((element) => element.remove());
    if(size == "" || size == undefined) size = 16;
    if(size > 100) size = 100;
    grid(size);
}

document.body.addEventListener('mousedown', dragStart);
document.body.addEventListener('mouseup', dragEnd);
const button = document.querySelector('button').addEventListener('click', () => { 
    replaceGrid(prompt("Side length"));
})


grid(16);