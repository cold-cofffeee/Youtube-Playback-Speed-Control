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
  autoSkipIntros: false,
  forceSpeedAllVideos: false,
  debugLogging: false,
  darkMode: false,
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
    this.initTheme();
  }

  initTheme() {
    // Load theme from storage or default
    chrome.storage.sync.get(['darkMode'], (result) => {
      const darkMode = result.darkMode !== undefined ? result.darkMode : DEFAULT_SETTINGS.darkMode;
      this.applyTheme(darkMode);
    });
  }

  applyTheme(darkMode) {
    const html = document.documentElement;
    const lightBtn = document.getElementById('lightModeBtn');
    const darkBtn = document.getElementById('darkModeBtn');
    
    if (darkMode) {
      html.classList.add('dark');
      lightBtn.classList.remove('bg-white', 'text-slate-900', 'shadow-sm');
      lightBtn.classList.add('bg-transparent', 'text-slate-500', 'dark:text-slate-400');
      darkBtn.classList.remove('bg-transparent', 'text-slate-500', 'dark:text-slate-400');
      darkBtn.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white', 'shadow-sm');
    } else {
      html.classList.remove('dark');
      darkBtn.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-900', 'dark:text-white', 'shadow-sm');
      darkBtn.classList.add('bg-transparent', 'text-slate-500', 'dark:text-slate-400');
      lightBtn.classList.remove('bg-transparent', 'text-slate-500', 'dark:text-slate-400');
      lightBtn.classList.add('bg-white', 'text-slate-900', 'shadow-sm');
    }
  }

  async loadKeycodes() {
    try {
      const response = await fetch('keycodedict.json');
      const data = await response.json();
      this.keycodes = data.keycodedict;
    } catch (error) {
      console.error('Failed to load keycodes:', error);
    }
  }

  getKeyDisplayName(keycode) {
    if (!this.keycodes || !keycode) return '';
    const keyData = this.keycodes.find(k => k.keycode === keycode);
    return keyData ? keyData.input : keycode;
  }

  setupKeyboardCapture(inputId, clearBtnId) {
    const input = document.getElementById(inputId);
    const clearBtn = document.getElementById(clearBtnId);
    
    input.addEventListener('click', () => {
      input.value = 'Press any key...';
      input.classList.add('ring-primary', 'ring-2');
    });

    input.addEventListener('keydown', (e) => {
      e.preventDefault();
      
      const keys = [];
      if (e.ctrlKey) keys.push('Ctrl');
      if (e.altKey) keys.push('Alt');
      if (e.shiftKey) keys.push('Shift');
      if (e.metaKey) keys.push('Meta');
      
      // Add the actual key if it's not a modifier
      const key = e.key;
      if (!['Control', 'Alt', 'Shift', 'Meta'].includes(key)) {
        if (key === ' ') {
          keys.push('Space');
        } else if (key === 'ArrowUp') {
          keys.push('↑');
        } else if (key === 'ArrowDown') {
          keys.push('↓');
        } else if (key === 'ArrowLeft') {
          keys.push('←');
        } else if (key === 'ArrowRight') {
          keys.push('→');
        } else {
          keys.push(key.length === 1 ? key.toUpperCase() : key);
        }
      }
      
      input.value = keys.join(' + ') || 'Press any key...';
      input.classList.remove('ring-primary', 'ring-2');
      
      // Store the keycode for saving
      input.dataset.keycode = e.keyCode || e.which;
    });

    input.addEventListener('blur', () => {
      input.classList.remove('ring-primary', 'ring-2');
      if (input.value === 'Press any key...') {
        input.value = '';
      }
    });

    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      input.value = '';
      input.dataset.keycode = '';
    });
  }

  setupEventListeners() {
    document.getElementById('save').addEventListener('click', () => this.saveOptions());
    document.getElementById('restore').addEventListener('click', () => this.restoreDefaults());
    document.getElementById('speedStep').addEventListener('keypress', this.validateNumberInput);
    
    // Setup keyboard capture for shortcuts
    this.setupKeyboardCapture('fasterKeyInput', 'clearFasterKey');
    this.setupKeyboardCapture('slowerKeyInput', 'clearSlowerKey');
    this.setupKeyboardCapture('resetKeyInput', 'clearResetKey');
    
    // Theme toggle listeners - both buttons toggle between light/dark
    document.getElementById('lightModeBtn').addEventListener('click', () => {
      const currentDarkMode = document.documentElement.classList.contains('dark');
      const newDarkMode = !currentDarkMode;
      this.applyTheme(newDarkMode);
      chrome.storage.sync.set({ darkMode: newDarkMode });
    });
    document.getElementById('darkModeBtn').addEventListener('click', () => {
      const currentDarkMode = document.documentElement.classList.contains('dark');
      const newDarkMode = !currentDarkMode;
      this.applyTheme(newDarkMode);
      chrome.storage.sync.set({ darkMode: newDarkMode });
    });
    
    // Advanced tab event listeners
    document.getElementById('clearWebsiteData').addEventListener('click', () => this.clearWebsiteData());
    document.getElementById('exportConfig').addEventListener('click', () => this.exportConfiguration());
    document.getElementById('importConfig').addEventListener('click', () => this.importConfiguration());
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
    const slowerKeyCode = document.getElementById('slowerKeyInput').dataset.keycode || DEFAULT_SETTINGS.slowerKeyCode;
    const fasterKeyCode = document.getElementById('fasterKeyInput').dataset.keycode || DEFAULT_SETTINGS.fasterKeyCode;
    const resetKeyCode = document.getElementById('resetKeyInput').dataset.keycode || DEFAULT_SETTINGS.resetKeyCode;
    const allowMouseWheel = document.getElementById('allowMouseWheel').checked;
    const rememberSpeed = document.getElementById('rememberSpeed').checked;
    const hideSettingButton = document.getElementById('hideSettingButton').checked;
    const enableAllVideosButton = document.getElementById('enableAllVideosButton').checked;
    const autoSkipIntros = document.getElementById('autoSkipIntros').checked;
    const forceSpeedAllVideos = document.getElementById('forceSpeedAllVideos').checked;
    const debugLogging = document.getElementById('debugLogging').checked;

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

    // Get current theme
    const darkMode = document.documentElement.classList.contains('dark');

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
      enableAllVideosButton,
      autoSkipIntros,
      forceSpeedAllVideos,
      debugLogging,
      darkMode
    }, () => {
      this.showStatus('Options saved successfully!', 'success');
    });
  }

  restoreOptions() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
      document.getElementById('speedStep').value = items.speedStep.toFixed(2);
      
      // Restore keyboard shortcuts with friendly display names
      const slowerInput = document.getElementById('slowerKeyInput');
      const fasterInput = document.getElementById('fasterKeyInput');
      const resetInput = document.getElementById('resetKeyInput');
      
      slowerInput.dataset.keycode = items.slowerKeyCode;
      fasterInput.dataset.keycode = items.fasterKeyCode;
      resetInput.dataset.keycode = items.resetKeyCode;
      
      slowerInput.value = this.getKeyDisplayName(items.slowerKeyCode);
      fasterInput.value = this.getKeyDisplayName(items.fasterKeyCode);
      resetInput.value = this.getKeyDisplayName(items.resetKeyCode);
      
      document.getElementById('allowMouseWheel').checked = items.allowMouseWheel;
      document.getElementById('rememberSpeed').checked = items.rememberSpeed;
      document.getElementById('hideSettingButton').checked = items.hideSettingButton;
      document.getElementById('enableAllVideosButton').checked = items.enableAllVideosButton;
      document.getElementById('autoSkipIntros').checked = items.autoSkipIntros;
      document.getElementById('forceSpeedAllVideos').checked = items.forceSpeedAllVideos;
      document.getElementById('debugLogging').checked = items.debugLogging;

      // Restore theme
      this.applyTheme(items.darkMode);

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
    if (!confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.')) {
      return;
    }
    chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
      this.restoreOptions();
      this.showStatus('Default options restored!', 'info');
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
    const statusText = document.getElementById('statusText');
    
    statusText.textContent = message;
    
    // Set colors based on type
    if (type === 'success') {
      statusElement.className = 'fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 bg-green-500 text-white';
    } else if (type === 'error') {
      statusElement.className = 'fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 bg-red-500 text-white';
    } else {
      statusElement.className = 'fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 bg-blue-500 text-white';
    }
    
    // Show toast
    statusElement.style.transform = 'translateY(0)';
    statusElement.style.opacity = '1';

    setTimeout(() => {
      statusElement.style.transform = 'translateY(5rem)';
      statusElement.style.opacity = '0';
    }, 3000);
  }

  updateTimeSaved() {
    chrome.storage.sync.get({ secSaved: 0 }, (items) => {
      const seconds = items.secSaved;
      if (seconds > 0) {
        const timeString = this.formatTimeSaved(seconds);
        document.getElementById('totalSavedTime').textContent = `Time saved by speeding up videos: ${timeString}`;
        document.getElementById('timeSavedSection').style.display = 'block';
      }
    });
  }

  clearWebsiteData() {
    if (confirm('Are you sure you want to clear all per-website speed settings? This action cannot be undone.')) {
      chrome.storage.local.clear(() => {
        this.showStatus('Website speed data cleared successfully!', 'success');
      });
    }
  }

  exportConfiguration() {
    chrome.storage.sync.get(null, (items) => {
      const config = JSON.stringify(items, null, 2);
      const blob = new Blob([config], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `playback-speed-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      this.showStatus('Configuration exported successfully!', 'success');
    });
  }

  importConfiguration() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target.result);
          chrome.storage.sync.set(config, () => {
            this.restoreOptions();
            this.showStatus('Configuration imported successfully!', 'success');
          });
        } catch (error) {
          this.showStatus('Invalid configuration file!', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
});
