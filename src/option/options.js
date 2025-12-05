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
    // Update time saved every 5 seconds
    setInterval(() => this.updateTimeSaved(), 5000);
  }

  async loadKeycodes() {
    try {
      const response = await fetch('keycodedict.json');
      const data = await response.json();
      this.keycodes = data.keycodedict;
      this.populateKeySelects();
    } catch (error) {
      console.error('Failed to load keycodes:', error);
      // Fallback to basic keycodes if file not found
      this.keycodes = [
        { keycode: '107,187', input: '+ or =' },
        { keycode: '109,189', input: '- or _' },
        { keycode: '106', input: '* (Numpad)' }
      ];
      this.populateKeySelects();
    }
  }

  populateKeySelects() {
    const fasterSelect = document.getElementById('fasterKeyInput');
    const slowerSelect = document.getElementById('slowerKeyInput');
    const resetSelect = document.getElementById('resetKeyInput');

    [fasterSelect, slowerSelect, resetSelect].forEach(select => {
      if (select) {
        select.innerHTML = '';
        this.keycodes.forEach(keycode => {
          const option = document.createElement('option');
          option.value = keycode.keycode;
          option.textContent = keycode.input;
          select.appendChild(option);
        });
      }
    });
  }

  setupEventListeners() {
    const saveBtn = document.getElementById('save');
    const restoreBtn = document.getElementById('restore');
    const speedStepInput = document.getElementById('speedStep');

    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveOptions());
    }

    if (restoreBtn) {
      restoreBtn.addEventListener('click', () => this.restoreDefaults());
    }

    if (speedStepInput) {
      speedStepInput.addEventListener('keypress', this.validateNumberInput.bind(this));
    }

    // Add change listeners for radio buttons to provide instant feedback
    const displayOptions = document.querySelectorAll('input[name="displayOption"]');
    displayOptions.forEach(option => {
      option.addEventListener('change', () => {
        // Visual feedback on selection
        document.querySelectorAll('.option-card').forEach(card => {
          const input = card.querySelector('input[type="radio"]');
          if (input && input.checked) {
            card.style.borderColor = 'var(--primary-color)';
          }
        });
      });
    });

    const displayPositions = document.querySelectorAll('input[name="displayPosition"]');
    displayPositions.forEach(position => {
      position.addEventListener('change', () => {
        // Visual feedback on selection
        document.querySelectorAll('.option-card').forEach(card => {
          const input = card.querySelector('input[type="radio"]');
          if (input && input.checked) {
            card.style.borderColor = 'var(--primary-color)';
          }
        });
      });
    });
  }

  validateNumberInput(event) {
    const char = String.fromCharCode(event.keyCode || event.which);
    const currentValue = event.target.value;
    
    // Allow digits and decimal point
    if (!/[\d.]/.test(char)) {
      event.preventDefault();
      return;
    }
    
    // Prevent multiple decimal points
    if (char === '.' && currentValue.includes('.')) {
      event.preventDefault();
      return;
    }
    
    // Check if result would be valid number
    const newValue = currentValue + char;
    if (!/^\d*\.?\d*$/.test(newValue)) {
      event.preventDefault();
    }
  }

  saveOptions() {
    const speedStepInput = document.getElementById('speedStep');
    const slowerKeyInput = document.getElementById('slowerKeyInput');
    const fasterKeyInput = document.getElementById('fasterKeyInput');
    const resetKeyInput = document.getElementById('resetKeyInput');
    const allowMouseWheelInput = document.getElementById('allowMouseWheel');
    const rememberSpeedInput = document.getElementById('rememberSpeed');
    const hideSettingButtonInput = document.getElementById('hideSettingButton');
    const enableAllVideosButtonInput = document.getElementById('enableAllVideosButton');

    if (!speedStepInput || !slowerKeyInput || !fasterKeyInput || !resetKeyInput) {
      console.error('Required form elements not found');
      return;
    }

    const speedStep = parseFloat(speedStepInput.value);
    const slowerKeyCode = slowerKeyInput.value;
    const fasterKeyCode = fasterKeyInput.value;
    const resetKeyCode = resetKeyInput.value;
    const allowMouseWheel = allowMouseWheelInput ? allowMouseWheelInput.checked : true;
    const rememberSpeed = rememberSpeedInput ? rememberSpeedInput.checked : false;
    const hideSettingButton = hideSettingButtonInput ? hideSettingButtonInput.checked : false;
    const enableAllVideosButton = enableAllVideosButtonInput ? enableAllVideosButtonInput.checked : true;

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
    const validSpeedStep = isNaN(speedStep) || speedStep < 0.05 || speedStep > 1 
      ? DEFAULT_SETTINGS.speedStep 
      : speedStep;

    if (validSpeedStep !== speedStep) {
      this.showStatus('Speed step must be between 0.05 and 1.0. Using default value.', 'info');
      speedStepInput.value = validSpeedStep.toFixed(2);
    }

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
      if (chrome.runtime.lastError) {
        this.showStatus('Error saving settings: ' + chrome.runtime.lastError.message, 'danger');
      } else {
        this.showStatus('✓ Settings saved successfully!', 'success');
      }
    });
  }

  restoreOptions() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
      const speedStepInput = document.getElementById('speedStep');
      const slowerKeyInput = document.getElementById('slowerKeyInput');
      const fasterKeyInput = document.getElementById('fasterKeyInput');
      const resetKeyInput = document.getElementById('resetKeyInput');
      const allowMouseWheelInput = document.getElementById('allowMouseWheel');
      const rememberSpeedInput = document.getElementById('rememberSpeed');
      const hideSettingButtonInput = document.getElementById('hideSettingButton');
      const enableAllVideosButtonInput = document.getElementById('enableAllVideosButton');

      if (speedStepInput) speedStepInput.value = items.speedStep.toFixed(2);
      if (slowerKeyInput) slowerKeyInput.value = items.slowerKeyCode;
      if (fasterKeyInput) fasterKeyInput.value = items.fasterKeyCode;
      if (resetKeyInput) resetKeyInput.value = items.resetKeyCode;
      if (allowMouseWheelInput) allowMouseWheelInput.checked = items.allowMouseWheel;
      if (rememberSpeedInput) rememberSpeedInput.checked = items.rememberSpeed;
      if (hideSettingButtonInput) hideSettingButtonInput.checked = items.hideSettingButton;
      if (enableAllVideosButtonInput) enableAllVideosButtonInput.checked = items.enableAllVideosButton;

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
    if (confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
        this.restoreOptions();
        this.showStatus('✓ Default settings restored!', 'info');
      });
    }
  }

  updateTimeSaved() {
    chrome.storage.sync.get({ secSaved: 0 }, (items) => {
      const timeString = this.formatTimeSaved(items.secSaved);
      const timeSavedElement = document.getElementById('totalSavedTime');
      if (timeSavedElement) {
        timeSavedElement.textContent = timeString;
      }
    });
  }

  formatTimeSaved(seconds) {
    if (seconds === 0) {
      return 'No time saved yet. Start watching videos!';
    }

    const days = Math.floor(seconds / (60 * 60 * 24));
    const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = Math.floor(seconds % 60);

    let result = '';
    if (days > 0) result += `${days} Day${days !== 1 ? 's' : ''} `;
    if (hours > 0 || days > 0) result += `${hours} Hour${hours !== 1 ? 's' : ''} `;
    if (minutes > 0 || hours > 0 || days > 0) result += `${minutes} Minute${minutes !== 1 ? 's' : ''} `;
    if (days === 0 && hours === 0) result += `${secs} Second${secs !== 1 ? 's' : ''}`;

    return result.trim() || '0 Seconds';
  }

  showStatus(message, type = 'success') {
    const statusElement = document.getElementById('status');
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.className = `alert alert-${type}`;
    statusElement.style.display = 'block';

    setTimeout(() => {
      statusElement.style.display = 'none';
      statusElement.textContent = '';
      statusElement.className = 'alert';
    }, 4000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});
