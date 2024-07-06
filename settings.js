document.getElementById('settings').addEventListener('click', function () {
  if (document.getElementById('cube-container').style.display !== 'none') {
    document.getElementById('cube-container').style.display = 'none';
    document.getElementById('settings-panel').style.display = 'block';
    document.getElementById('controls').style.display = 'none';
  } else {
    document.getElementById('cube-container').style.display = 'block';
    document.getElementById('settings-panel').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
  }
});

document.getElementById('mouse-navigate-setting').addEventListener('click', function() {
    const navigateCheck = document.getElementById('mouse-navigate-setting');
    
    if (navigateCheck.checked) {
      navigatable = true;
    } else {
      navigatable = false;
    }
});

document.getElementById('show-helper-text-setting').addEventListener('click', function() {
  const helperTextShowCheck = document.getElementById('show-helper-text-setting');
  
  if (helperTextShowCheck.checked) {
    showHelperText = true;
  } else {
    showHelperText = false;
  }

  drawTexts();
});

const keyboardOptions = document.querySelectorAll('.keyboard-option');

keyboardOptions.forEach(option => {
  option.addEventListener('click', function(event) {
    option.classList.add('selected');
    keyboardOptions.forEach(otherOption => {
      if (otherOption !== option) {
        otherOption.classList.remove('selected');
      }
    })

    chrome.storage.sync.set(defaultSettings, function() {
      console.log('Settings set:', defaultSettings);
      // Use retrieved settings as needed
    });
  });
});

const defaultSettings = {
  keyboardSetting: 'Option 1: FBRLUDGIJ + space'
};

// loadSettings();

// function loadSettings() {
//   chrome.storage.sync.get(defaultSettings, function(result) {
//     console.log('default settings', result);
//     defaultSettings.keyboardSetting = result;
//   });
// }