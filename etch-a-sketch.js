let selectedColor = 'black';
let previousColor = 'grey';
let clicked = false;
let drag = false;

const dragStart = (event) => {
    drag = true;
}

const dragEnd = (event) => {
    drag = false;
}

const mouseEnterCell = (event) => {
    if(drag) {
        event.target.style['background-color'] = selectedColor;
        return;
    }
    previousColor = event.target.style['background-color'];
    event.target.style['background-color'] = selectedColor;
}

const mouseExitCell = (event) => {
    if(drag || clicked) {
        clicked = false;
        return;
    }
    event.target.style['background-color'] = previousColor;
}

const mouseUpCell = (event) => {
    clicked = true;
    event.target.style['background-color'] = selectedColor;
}



const grid = (size) => {
    const root = document.querySelector('.grid');
    root.style['grid-template-columns'] = `fit-content(40%)`
    root.style['grid-template-rows'] = `fit-content(40%)`

    let cell;
    for(let x = 0; x < size; x++) {

        for(let y = 0; y < size; y++) {
            cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style['grid-row-start'] = y
            cell.style['grid-row-start'] = y + 1;
            cell.style['grid-column-start'] = x
            cell.style['grid-column-start'] = x + 1;

            cell.addEventListener('mouseenter', mouseEnterCell);
            cell.addEventListener('mouseleave', mouseExitCell);
            cell.addEventListener('mouseup', mouseUpCell)
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