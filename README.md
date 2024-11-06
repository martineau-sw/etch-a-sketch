# Project: Etch-a-sketch

## Description

A webpage with a square grid of configurable resolution (max 100x100) that leaves a black trail when the mouse passes over.

## Steps
- [x] Create GitHub Repository
- [x] Create a web page
- [x] Generate 16x16 `div` grid within `flexbox` container using JavaScript
- [x] Change color of the `div` when the mouse passes over
- [x] Add a `button` for user to define grid resolution 
- [x] Optional: Randomize RGB values per color change
- [x] Optional: Accumulate opacity

## Problem Solving

### Understand

Create a webpage with a square `div` grid of configurable resolution at a max of 100x100 that leaves a trail on mouse over.

### Plan

#### User Interface 

- `div` element arranged in a square grid with `flexbox` display mode that changes color on mouse over.
- `button` element that requests integer value for resolution of `div` grid.
	- Screen-space should remain constant.

#### Input

- Mouse hover event
- Button for resolution configuration
	- Integer input \[8, 100]

#### Output

- Grid resolution
- Color change

#### Input to Output

- Generate initial 16x16 `div` grid on page in `flexbox` container
	- `flexbox` container in HTML
		- Fixed size
		- `flex-flow: row wrap(?)`
	- Grid generation through JavaScript
		- Create `div` in JS
		- Keep square somehow (CSS, JS)
		- `flex: 1`
		- Add mouse event handler that changes `background-color`
		- Append `div` to `flexbox` container
- "Resolution" `button` that prompts for integer input
	- `prompt` to get user input
		- Validate for integer `Number` \[8, 100]
		- Regenerate grid

#### Pseudocode

```pseudocode
FUNCTION generateGrid(resolution) 
	INIT container to select flex box container from DOM
	FOR resolution * resolution 
		INIT pixel to new div element
		SET pixel width to 1/resolution %
		SET pixel height to 1/resolution %
		add mouse enter event handler to change 'background-color' to black
		append pixel to container
	ENDFOR
ENDFUNCTION 

FUNCTION updateBackgroundColor(element, color)
	set element style to "background-color: black"
ENDFUNCTION

FUNCTION getUserResolution()
	set resolution to user prompt input "Resolution [8, 100]"
	IF resolution is not a number THEN
		alert "Resolution must be a number"
		CALL getUserResolution
	ENDIF
	IF resolution is not an integer THEN
		alert "Resolution must be an integer"
		CALL getUserResolution
	ENDIF
	IF resolution < 8 or resolution > 100 THEN
		alert "Resolution must be in range [8, 100]"
		CALL getUserResolution
	ENDIF
	remove grid
	CALL generateGrid(resolution)
ENDFUNCTION
```