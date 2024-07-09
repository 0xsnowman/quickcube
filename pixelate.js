const canvas = document.getElementById('pixelArtCanvas');
const zoomCanvas = document.getElementById('zoomCanvas');
const ctx = canvas.getContext('2d');
const zoomCtx = zoomCanvas.getContext('2d');

// Number of grid cells
const gridSize = 15;
// Size of each grid cell
const cellSize = canvas.width / gridSize;

// Colors array
const colors = [
    '#D00000', '#FB4009', '#00A3E8', '#23B14D', '#FEF200', '#FFFFFF',
];

// Draw the grid with colored rectangles
for (let row = 0; row < 5; row++) {
    const rowColors = [];
    for (let col = 0; col < 5; col++) {
        const boxColors = [];
        // Randomly select a color for each cell
        for (let i = 0; i < SIZE; ++i) {
            for (let j = 0; j < SIZE; ++j) {
                const color = colors[Math.floor(Math.random() * colors.length)];

                boxColors.push(color);

                // Set the fill color
                ctx.fillStyle = color;

                const rowIndex = row * 3 + i;
                const colIndex = col * 3 + j;

                // Draw the rectangle
                ctx.fillRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);

                if (i === 1 && j === 1) {
                    // Set font properties
                    ctx.font = '14px Arial';  // Font size and typeface

                    // Set text properties
                    ctx.fillStyle = 'black';  // Text color
                    ctx.textAlign = 'center';  // Text alignment
                    ctx.textBaseline = 'middle';  // Text baseline

                    // Position and draw the text
                    const x = colIndex * cellSize + cellSize / 2;  // X-coordinate of the text center
                    const y = rowIndex * cellSize + cellSize / 2; // Y-coordinate of the text center
                    const text = row * 5 + col + 1;  // Text to display

                    ctx.fillText(text, x, y);  // Fill text
                }
            }
        }

        rowColors.push(boxColors);
    }

    colorGrid.push(rowColors);
}

// Draw black lines between each rectangle
ctx.strokeStyle = '#000000';
ctx.lineWidth = 1;

for (let i = 0; i <= gridSize; i++) {
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();

    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
}

// Draw thick black lines between each 3x3 grid of rectangles
ctx.lineWidth = 3;

for (let i = 0; i <= gridSize; i += 3) {
    // Thick vertical lines
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();

    // Thick horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
}

/* ---- zoom canvas ---- */
/* ---- zoom canvas ---- */