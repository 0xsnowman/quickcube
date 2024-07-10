const canvas = document.getElementById('pixelArtCanvas');
const zoomCanvas = document.getElementById('zoomCanvas');
const ctx = canvas.getContext('2d');
const zoomCtx = zoomCanvas.getContext('2d');

// Number of grid cells
const GRID_SIZE = 5;

// Size of each grid cell
const cellSize = canvas.width / (GRID_SIZE * SIZE);

const targetBlocks = [];

// Colors array - (r o g b w y)
const planeColors = [
    '#D00000', '#FB4009', '#23B14D', '#00A3E8', '#FFFFFF', '#FEF200',
];

document.addEventListener('DOMContentLoaded', function () {

    // Draw the grid with colored rectangles
    for (let row = 0; row < GRID_SIZE; row++) {
        const rowColors = [];
        for (let col = 0; col < GRID_SIZE; col++) {
            const boxColors = [];
            // Randomly select a color for each cell
            for (let i = 0; i < SIZE; ++i) {
                for (let j = 0; j < SIZE; ++j) {
                    const color = planeColors[Math.floor(Math.random() * planeColors.length)];

                    boxColors.push(color);

                    // Set the fill color
                    ctx.fillStyle = color;

                    const rowIndex = row * SIZE + i;
                    const colIndex = col * SIZE + j;

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
                        const text = row * GRID_SIZE + col + 1;  // Text to display

                        ctx.fillText(text, x, y);  // Fill text
                    }
                }
            }

            rowColors.push(boxColors);
        }

        colorGrid.push(rowColors);
    }

    // Draw black lines between each rectangle
    ctx.strokeStyle = BACKGROUND_COLOR;
    ctx.lineWidth = 1;

    for (let i = 0; i <= GRID_SIZE * SIZE; i++) {
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

    for (let i = 0; i <= GRID_SIZE * SIZE; i += 3) {
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

    redrawTargetBlocks();
});

function redrawTargetBlocks() {
    targetBlocks.forEach((block) => {
        // Draw the sloped lines in the specified 3x3 block
        const blockSize = canvas.width / GRID_SIZE;
        const targetBlockX = block.x; // 6th column
        const targetBlockY = block.y; // 6th row
        const targetBlockSize = 1; // 3x3 block

        const startX = targetBlockX * blockSize;
        const startY = targetBlockY * blockSize;
        const endX = (targetBlockX + targetBlockSize) * blockSize;
        const endY = (targetBlockY + targetBlockSize) * blockSize;
        const step = (endX - startX) / (GRID_SIZE * 2); // Divide the block into 10 sections for sloped lines

        ctx.strokeStyle = FOREGROUND_COLOR;
        for (let i = 0; i <= GRID_SIZE * 2; i++) {
            ctx.beginPath();
            ctx.moveTo(startX, startY + i * step);
            ctx.lineTo(startX + i * step, startY);
            ctx.stroke();
        }

        for (let i = 0; i <= GRID_SIZE * 2; i++) {
            ctx.beginPath();
            ctx.moveTo(startX + i * step, endY);
            ctx.lineTo(endX, startY + i * step);
            ctx.stroke();
        }
    });
}