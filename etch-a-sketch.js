let selectedColor = 'black';
let previousColor = 'grey';
let drag = false;

const dragStart = (event) => {
    drag = true;
}

const dragEnd = (event) => {
    drag = false;
}

document.body.addEventListener('mousedown', dragStart);
document.body.addEventListener('mouseup', dragEnd);

const grid = () => {
    const root = document.querySelector('.grid');
    const rows = document.createElement('div');
    rows.classList.add('rows');

    const size = 16;
    let cell;
    for(let x = 0; x < size; x++) {

        const row = document.createElement('div');
        row.classList.add('row');

        for(let y = 0; y < size; y++) {
            cell = document.createElement('div');
            cell.classList.add('cell');
            cell.classList.add(`row${y}`);
            cell.classList.add(`column${x}`);

            cell.addEventListener('mouseenter', mouseEnterCell);
            cell.addEventListener('mouseleave', mouseExitCell);
            cell.addEventListener('mouseup', mouseUpCell)
            row.appendChild(cell);
        }

        rows.appendChild(row);
    }

    root.appendChild(rows);
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


grid();