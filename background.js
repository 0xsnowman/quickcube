chrome.commands.onCommand.addListener(function (command) {
    if (command === "open-quickcube") {
        chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
    }
});
