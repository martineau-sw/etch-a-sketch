const grid = () => {
    const root = document.createElement('div');
    root.classList.add('rows');

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
            row.appendChild(cell);

            
        }

        root.appendChild(row);
    }

    document.body.appendChild(root);
}

grid();