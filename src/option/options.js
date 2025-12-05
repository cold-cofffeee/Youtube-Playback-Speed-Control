/**
 * YouTube Playback Speed Control - Options Page Script
 * Manages user preferences and settings
 */

const DEFAULT_SETTINGS = {
  speedStep: 0.25,
  slowerKeyCode: '109,189',
  fasterKeyCode: '107,187',
  resetKeyCode: '106',
  displayOption: 'FadeInFadeOut',
  displayPosition: 'TopRight',
  allowMouseWheel: true,
  rememberSpeed: false,
  hideSettingButton: false,
  enableAllVideosButton: true,
  secSaved: 0
};

class OptionsManager {
  constructor() {
    this.keycodes = [];
    this.init();
  }

  async init() {
    await this.loadKeycodes();
    this.setupEventListeners();
    this.restoreOptions();
    this.updateTimeSaved();
  }

  async loadKeycodes() {
    try {
      const response = await fetch('keycodedict.json');
      const data = await response.json();
      this.keycodes = data.keycodedict;
      this.populateKeySelects();
    } catch (error) {
      console.error('Failed to load keycodes:', error);
    }
  }

  populateKeySelects() {
    const fasterSelect = document.getElementById('fasterKeyInput');
    const slowerSelect = document.getElementById('slowerKeyInput');
    const resetSelect = document.getElementById('resetKeyInput');

    [fasterSelect, slowerSelect, resetSelect].forEach(select => {
      select.innerHTML = '';
      this.keycodes.forEach(keycode => {
        const option = document.createElement('option');
        option.value = keycode.keycode;
        option.textContent = keycode.input;
        select.appendChild(option);
      });
    });
  }

  setupEventListeners() {
    document.getElementById('save').addEventListener('click', () => this.saveOptions());
    document.getElementById('restore').addEventListener('click', () => this.restoreDefaults());
    document.getElementById('speedStep').addEventListener('keypress', this.validateNumberInput);
  }

  validateNumberInput(event) {
    const char = String.fromCharCode(event.keyCode || event.which);
    const currentValue = event.target.value;
    
    // Allow digits and decimal point
    if (!/[\d.]/.test(char)) {
      event.preventDefault();
      return;
    }
    
    // Check if result would be valid number
    if (!/^\d+(\.\d*)?$/.test(currentValue + char)) {
      event.preventDefault();
    }
  }

  saveOptions() {
    const speedStep = parseFloat(document.getElementById('speedStep').value);
    const slowerKeyCode = document.getElementById('slowerKeyInput').value;
    const fasterKeyCode = document.getElementById('fasterKeyInput').value;
    const resetKeyCode = document.getElementById('resetKeyInput').value;
    const allowMouseWheel = document.getElementById('allowMouseWheel').checked;
    const rememberSpeed = document.getElementById('rememberSpeed').checked;
    const hideSettingButton = document.getElementById('hideSettingButton').checked;
    const enableAllVideosButton = document.getElementById('enableAllVideosButton').checked;

    // Get selected display option
    const displayOptions = document.getElementsByName('displayOption');
    let displayOption = DEFAULT_SETTINGS.displayOption;
    for (const option of displayOptions) {
      if (option.checked) {
        displayOption = option.value;
        break;
      }
    }

    // Get selected display position
    const displayPositions = document.getElementsByName('displayPosition');
    let displayPosition = DEFAULT_SETTINGS.displayPosition;
    for (const position of displayPositions) {
      if (position.checked) {
        displayPosition = position.value;
        break;
      }
    }

    // Validate speed step
    const validSpeedStep = isNaN(speedStep) ? DEFAULT_SETTINGS.speedStep : speedStep;

    // Save to Chrome storage
    chrome.storage.sync.set({
      speedStep: validSpeedStep,
      slowerKeyCode,
      fasterKeyCode,
      resetKeyCode,
      displayOption,
      displayPosition,
      allowMouseWheel,
      rememberSpeed,
      hideSettingButton,
      enableAllVideosButton
    }, () => {
      this.showStatus('Options saved successfully!', 'success');
    });
  }

  restoreOptions() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
      document.getElementById('speedStep').value = items.speedStep.toFixed(2);
      document.getElementById('slowerKeyInput').value = items.slowerKeyCode;
      document.getElementById('fasterKeyInput').value = items.fasterKeyCode;
      document.getElementById('resetKeyInput').value = items.resetKeyCode;
      document.getElementById('allowMouseWheel').checked = items.allowMouseWheel;
      document.getElementById('rememberSpeed').checked = items.rememberSpeed;
      document.getElementById('hideSettingButton').checked = items.hideSettingButton;
      document.getElementById('enableAllVideosButton').checked = items.enableAllVideosButton;

      // Restore display option
      const displayOption = document.getElementById(items.displayOption);
      if (displayOption) {
        displayOption.checked = true;
      }

      // Restore display position
      const displayPosition = document.getElementById(items.displayPosition);
      if (displayPosition) {
        displayPosition.checked = true;
      }
    });
  }

  restoreDefaults() {
    chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
      this.restoreOptions();
      this.showStatus('Default options restored!', 'info');
    });
  }

  updateTimeSaved() {
    chrome.storage.sync.get({ secSaved: 0 }, (items) => {
      const timeString = this.formatTimeSaved(items.secSaved);
      document.getElementById('totalSavedTime').textContent = `You have saved ${timeString}`;
    });
  }

  formatTimeSaved(seconds) {
    const days = Math.floor(seconds / (60 * 60 * 24));
    const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = Math.round((seconds % 60) * 100) / 100;

    let result = '';
    if (days > 0) result += `${days} Day${days !== 1 ? 's' : ''} `;
    if (hours > 0 || days > 0) result += `${String(hours).padStart(2, '0')} Hour${hours !== 1 ? 's' : ''} `;
    if (minutes > 0 || hours > 0 || days > 0) result += `${String(minutes).padStart(2, '0')} Minute${minutes !== 1 ? 's' : ''} `;
    result += `${String(secs).padStart(2, '0')} Second${secs !== 1 ? 's' : ''}`;

    return result.trim();
  }

  showStatus(message, type = 'success') {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = `alert alert-${type}`;
    statusElement.style.display = 'block';

    setTimeout(() => {
      statusElement.style.display = 'none';
      statusElement.textContent = '';
      statusElement.className = '';
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});
