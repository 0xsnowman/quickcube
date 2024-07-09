// Function to create pixel art from an image with a 64x64 grid
function createPixelArt(imageUrl) {
    const canvas = document.getElementById('pixelArtCanvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Enable CORS if needed
    img.onload = function () {
        const gridSize = 16; // Size of the grid
        const canvasSize = 256; // Size of the canvas

        const cellSize = canvasSize / gridSize; // Size of each grid cell

        // Clear previous drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the resized image in pixelated style
        ctx.imageSmoothingEnabled = false; // Disable smoothing for pixelated effect

        // Calculate average color for each grid cell
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                const startX = x * cellSize;
                const startY = y * cellSize;
                const endX = startX + cellSize;
                const endY = startY + cellSize;

                // Calculate average color for the current cell
                const averageColor = getAverageColor(ctx, img, startX, startY, endX, endY);

                // Draw the cell with the average color
                ctx.fillStyle = `rgb(${averageColor.r}, ${averageColor.g}, ${averageColor.b})`;
                ctx.fillRect(startX, startY, cellSize, cellSize);
            }
        }
    }

    function getAverageColor(ctx, img, startX, startY, endX, endY) {
        let totalR = 0, totalG = 0, totalB = 0;
        let count = 0;

        // Ensure that the image is fully loaded
        ctx.drawImage(img, 0, 0);

        // Get the image data for the specified region
        const imgData = ctx.getImageData(startX, startY, endX - startX, endY - startY);
        const data = imgData.data;

        // Calculate sum of RGB values
        for (let i = 0; i < data.length; i += 4) {
            totalR += data[i];     // Red
            totalG += data[i + 1]; // Green
            totalB += data[i + 2]; // Blue
            count++;
        }

        // Calculate average RGB values
        const averageR = Math.round(totalR / count);
        const averageG = Math.round(totalG / count);
        const averageB = Math.round(totalB / count);

        return { r: averageR, g: averageG, b: averageB };
    }

    // Load image from URL
    img.src = imageUrl;
};

// Example usage
const imageUrl = './assets/faces/person1.jpeg'; // Replace with your image URL
createPixelArt(imageUrl);