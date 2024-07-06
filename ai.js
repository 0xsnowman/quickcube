let copyOfRandomizerString = [];

document.addEventListener('keyup', function (event) {
    if (event.key.toLowerCase() === '`' || event.key.toLowerCase() === '~') {
        const shuffleString = 'frubld';
        const reversedArray = userKeyHistory.reverse();
        reversedArray.forEach((key) => {
            keyQueue.push(' ');
            keyQueue.push(key);
        })
        while (copyOfRandomizerString.length > 0) {
            const randomShuffleKey = copyOfRandomizerString[copyOfRandomizerString.length - 1];
            keyQueue.push(' ');
            keyQueue.push(shuffleString[randomShuffleKey % 6]);
            copyOfRandomizerString = copyOfRandomizerString.slice(0, copyOfRandomizerString.length - 1);
        }
        handleAI();
    }
});

function handleAI() {
    const shuffleString = 'frubld';
    while (copyOfRandomizerString.length > 0) {
        const randomShuffleKey = copyOfRandomizerString[copyOfRandomizerString.length - 1];
        keyQueue.push(' ');
        keyQueue.push(shuffleString[randomShuffleKey % 6]);
        copyOfRandomizerString = copyOfRandomizerString.slice(0, copyOfRandomizerString.length - 1);
    }

    if (keyQueue.length > 0)
        handleKey(keyQueue[0]);
}