function congrats() {
    const timerID = setInterval(() => {
        const congratsElement = document.getElementById('congrats');
        if (Number(congratsElement.style.opacity) < 1) {
            congratsElement.style.opacity = Number(congratsElement.style.opacity) + 0.02;
            congratsElement.style.cursor = 'pointer';
        } else {
            clearInterval(timerID);
        }
    }, 10);
}

document.getElementById('congrats').addEventListener('click', function (event) {
    const congratsElement = document.getElementById('congrats');
    congratsElement.style.opacity = 0;
    congratsElement.style.cursor = 'auto';
});

document.addEventListener('keyup', (event) => {
    if (event.key.toLowerCase() === '1') {
        openImagePreview();     
    }
});

function openImagePreview(imageUrl) {
    const popupUrl = chrome.runtime.getURL('pixelart.html'); // Get full URL to popup.html
    const popupWidth = 600;
    const popupHeight = 400;

    // Open popup with specified dimensions and pass imageUrl as a query parameter
    chrome.windows.create({
        url: `${popupUrl}`,
        type: 'popup',
        width: popupWidth,
        height: popupHeight
    });
}