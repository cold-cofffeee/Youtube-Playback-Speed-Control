/**
 * YouTube Playback Speed Control - Content Script
 * Manages video playback speed control for HTML5 videos
 */

class PlaybackSpeedController {
  constructor() {
    this.settings = {
      speed: 1.0,
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
    
    this.fadeTimeout = null;
    this.videoControllers = new Map();
    
    this.init();
  }

  async init() {
    try {
      await this.loadSettings();
      this.waitForDocumentReady();
    } catch (error) {
      console.error('Failed to initialize PlaybackSpeedController:', error);
    }
  }

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(this.settings, (items) => {
        this.settings = {
          speed: Number(items.speed),
          speedStep: Number(items.speedStep),
          slowerKeyCode: items.slowerKeyCode,
          fasterKeyCode: items.fasterKeyCode,
          resetKeyCode: items.resetKeyCode,
          displayOption: items.displayOption,
          displayPosition: items.displayPosition,
          allowMouseWheel: Boolean(items.allowMouseWheel),
          rememberSpeed: Boolean(items.rememberSpeed),
          hideSettingButton: Boolean(items.hideSettingButton),
          enableAllVideosButton: Boolean(items.enableAllVideosButton),
          secSaved: Number(items.secSaved)
        };
        resolve();
      });
    });
  }

  waitForDocumentReady() {
    if (document.readyState === 'complete') {
      this.onDocumentReady();
    } else {
      const interval = setInterval(() => {
        if (document.readyState === 'complete') {
          clearInterval(interval);
          this.onDocumentReady();
        }
      }, 10);
    }
  }

  onDocumentReady() {
    // Check if we should run on this site
    if (location.hostname !== 'www.youtube.com' && !this.settings.enableAllVideosButton) {
      return;
    }

    this.setupEventListeners();
    this.observeVideoElements();
    this.initializeExistingVideos();
  }

  setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeydown.bind(this), true);

    // Mouse wheel control
    if (this.settings.allowMouseWheel) {
      document.addEventListener('wheel', this.handleMouseWheel.bind(this), { passive: false });
    }

    // Fullscreen changes
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'].forEach(event => {
      document.addEventListener(event, this.handleFullscreenChange.bind(this), false);
    });
  }

  handleKeydown(event) {
    const keyCode = event.which || event.keyCode;
    
    // Don't trigger if user is typing in an input field or textarea
    const activeElement = document.activeElement;
    if (activeElement.nodeName === 'INPUT' && activeElement.getAttribute('type') === 'text') {
      return;
    }
    if (activeElement.nodeName === 'TEXTAREA' ||
        (activeElement.parentElement?.nodeName === 'YT-FORMATTED-STRING' &&
         activeElement.parentElement?.getAttribute('id') === 'contenteditable-textarea')) {
      return;
    }

    const keyCodeStr = keyCode.toString();
    
    if (this.settings.fasterKeyCode.includes(keyCodeStr)) {
      event.preventDefault();
      this.changeAllVideosSpeeds('faster');
    } else if (this.settings.slowerKeyCode.includes(keyCodeStr)) {
      event.preventDefault();
      this.changeAllVideosSpeeds('slower');
    } else if (this.settings.resetKeyCode.includes(keyCodeStr)) {
      event.preventDefault();
      this.changeAllVideosSpeeds('reset');
    }
  }

  handleMouseWheel(event) {
    if (event.shiftKey) {
      event.preventDefault();
      const delta = event.deltaY || -event.wheelDelta;
      
      if (delta < 0) {
        this.changeAllVideosSpeeds('faster');
      } else if (delta > 0) {
        this.changeAllVideosSpeeds('slower');
      }
    }
  }

  handleFullscreenChange() {
    const panels = document.querySelectorAll('.PlayBackRatePanelYPSC, .PlayBackRatePanelYPSCFullScreen');
    const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || 
                         document.mozFullScreenElement || document.msFullscreenElement;
    
    panels.forEach(panel => {
      panel.className = isFullscreen ? 'PlayBackRatePanelYPSCFullScreen' : 'PlayBackRatePanelYPSC';
      this.updatePanelPosition(panel, false);
    });
  }

  observeVideoElements() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeName === 'VIDEO' && !this.videoControllers.has(node)) {
              this.createVideoController(node);
            }
          });
        }
      });
    });

    observer.observe(document, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

  initializeExistingVideos() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      if (!this.videoControllers.has(video)) {
        this.createVideoController(video);
      }
    });
  }

  createVideoController(videoElement) {
    const controller = new VideoController(videoElement, this.settings, this);
    this.videoControllers.set(videoElement, controller);
    
    // Track time saved
    setInterval(() => {
      this.trackTimeSaved(videoElement);
    }, 1000);
  }

  async trackTimeSaved(video) {
    if (!video || video.paused || video.ended) return;
    
    if (video.playbackRate > 1) {
      try {
        const result = await chrome.storage.sync.get({ secSaved: 0 });
        await chrome.storage.sync.set({
          secSaved: result.secSaved + (video.playbackRate - 1)
        });
      } catch (error) {
        console.error('Error tracking time saved:', error);
      }
    }
  }

  changeAllVideosSpeeds(action) {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
      if (video.classList.contains('vc-cancelled')) return;
      
      let newSpeed;
      switch (action) {
        case 'faster':
          newSpeed = Math.min(video.playbackRate + this.settings.speedStep, 16);
          break;
        case 'slower':
          newSpeed = Math.max(video.playbackRate - this.settings.speedStep, 0.25);
          break;
        case 'reset':
          newSpeed = 1.0;
          break;
        default:
          return;
      }
      
      video.playbackRate = newSpeed;
    });

    // Show speed indicator temporarily
    this.showSpeedIndicatorTemporarily();
  }

  showSpeedIndicatorTemporarily() {
    const panels = document.querySelectorAll('.PlayBackRatePanelYPSC, .PlayBackRatePanelYPSCFullScreen');
    
    panels.forEach(panel => {
      const originalDisplay = panel.style.display;
      if (originalDisplay === 'none') {
        panel.style.display = 'inline';
        setTimeout(() => {
          panel.style.display = originalDisplay;
        }, 300);
      }
    });
  }

  showPanels() {
    const panels = document.querySelectorAll('.PlayBackRatePanelYPSC, .PlayBackRatePanelYPSCFullScreen');
    panels.forEach(panel => {
      panel.style.display = 'inline';
    });
  }

  hidePanels() {
    const panels = document.querySelectorAll('.PlayBackRatePanelYPSC, .PlayBackRatePanelYPSCFullScreen');
    panels.forEach(panel => {
      panel.style.display = 'none';
    });
  }

  updatePanelPosition(panel, isWidePlayer) {
    const pos = this.settings.displayPosition;
    
    // Reset all positions
    panel.style.top = 'initial';
    panel.style.right = 'initial';
    panel.style.bottom = 'initial';
    panel.style.left = 'initial';
    
    switch (pos) {
      case 'TopRight':
        panel.style.top = '2px';
        panel.style.right = isWidePlayer ? '0px' : '-44px';
        break;
      case 'TopCenter':
        panel.style.top = '2px';
        panel.style.left = '50%';
        break;
      case 'TopLeft':
        panel.style.top = '2px';
        panel.style.left = isWidePlayer ? '88px' : '64px';
        break;
      case 'BottomRight':
        panel.style.bottom = '6%';
        panel.style.right = '-44px';
        break;
      case 'BottomCenter':
        panel.style.bottom = '5px';
        panel.style.left = '50%';
        break;
      case 'BottomLeft':
        panel.style.bottom = '6%';
        panel.style.left = '44px';
        break;
    }
  }
}

class VideoController {
  constructor(videoElement, settings, mainController) {
    this.video = videoElement;
    this.settings = settings;
    this.mainController = mainController;
    this.speedIndicator = null;
    
    if (!this.settings.rememberSpeed) {
      this.settings.speed = 1.0;
    }
    
    this.init();
  }

  init() {
    this.createControlPanel();
    this.setupVideoListeners();
    this.video.playbackRate = this.settings.speed;
  }

  setupVideoListeners() {
    this.video.addEventListener('play', () => {
      this.video.playbackRate = this.settings.speed;
    });

    this.video.addEventListener('ratechange', () => {
      if (this.video.readyState === 0) return;
      
      const speed = parseFloat(this.video.playbackRate).toFixed(2);
      this.speedIndicator.textContent = speed;
      this.settings.speed = parseFloat(speed);
      
      chrome.storage.sync.set({ speed: parseFloat(speed) });
    });
  }

  createControlPanel() {
    const panel = document.createElement('div');
    panel.setAttribute('id', 'PlayBackRatePanelYPSC');
    panel.className = 'PlayBackRatePanelYPSC';

    // Speed display button
    const speedDisplay = document.createElement('button');
    speedDisplay.setAttribute('id', 'PlayBackRateYPSC');
    speedDisplay.className = 'btnYPSC';
    speedDisplay.textContent = parseFloat(this.settings.speed).toFixed(2);
    this.speedIndicator = speedDisplay;

    // Speed up button
    const speedUpBtn = document.createElement('button');
    speedUpBtn.setAttribute('id', 'SpeedUpYPSC');
    speedUpBtn.className = 'btnYPSC btnYPSC-right';
    speedUpBtn.textContent = '>>';
    speedUpBtn.title = 'Increase speed';

    // Speed down button
    const speedDownBtn = document.createElement('button');
    speedDownBtn.setAttribute('id', 'SpeedDownYPSC');
    speedDownBtn.className = 'btnYPSC btnYPSC-left';
    speedDownBtn.textContent = '<<';
    speedDownBtn.title = 'Decrease speed';

    // Settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.setAttribute('id', 'SettingYPSC');
    settingsBtn.className = 'btnYPSC';
    settingsBtn.title = 'Open settings';

    // Apply display options
    this.applyDisplayOptions(panel, speedUpBtn, speedDownBtn, speedDisplay, settingsBtn);

    // Add buttons to panel
    panel.appendChild(speedUpBtn);
    panel.appendChild(speedDisplay);
    panel.appendChild(speedDownBtn);
    panel.appendChild(settingsBtn);

    // Insert panel into DOM
    this.insertPanel(panel);

    // Setup event listeners
    this.setupPanelListeners(panel, speedUpBtn, speedDownBtn, speedDisplay, settingsBtn);
  }

  applyDisplayOptions(panel, speedUpBtn, speedDownBtn, speedDisplay, settingsBtn) {
    const displayOption = this.settings.displayOption;
    
    if (this.settings.hideSettingButton) {
      settingsBtn.style.display = 'none';
    }

    switch (displayOption) {
      case 'None':
        panel.style.display = 'none';
        break;
      case 'Always':
        panel.style.display = 'inline';
        break;
      case 'Simple':
        panel.style.display = 'inline';
        settingsBtn.style.display = 'none';
        speedUpBtn.style.display = 'none';
        speedDownBtn.style.display = 'none';
        speedDisplay.style.border = 'none';
        speedDisplay.style.background = 'transparent';
        break;
      case 'FadeInFadeOut':
        panel.style.display = 'none';
        break;
      default:
        panel.style.display = 'inline';
    }

    this.mainController.updatePanelPosition(panel, false);
  }

  insertPanel(panel) {
    let container = this.video.parentElement?.parentElement || this.video.parentElement || this.video;
    
    const fragment = document.createDocumentFragment();
    fragment.appendChild(panel);
    container.insertBefore(fragment, this.video.parentElement || this.video);

    // Setup hover events for fade in/out
    if (this.settings.displayOption === 'FadeInFadeOut') {
      container.addEventListener('mouseover', () => this.handleMouseOver());
      container.addEventListener('mouseout', () => this.handleMouseOut());
      container.addEventListener('mousemove', () => this.handleMouseMove());
      container.addEventListener('mouseleave', () => this.handleMouseLeave());
    }
  }

  setupPanelListeners(panel, speedUpBtn, speedDownBtn, speedDisplay, settingsBtn) {
    panel.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.target === speedUpBtn) {
        this.mainController.changeAllVideosSpeeds('faster');
      } else if (e.target === speedDownBtn) {
        this.mainController.changeAllVideosSpeeds('slower');
      } else if (e.target === speedDisplay) {
        this.mainController.changeAllVideosSpeeds('reset');
      } else if (e.target === settingsBtn) {
        chrome.runtime.sendMessage({ action: 'openOptionsPage' });
      }
    }, true);

    panel.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, true);
  }

  handleMouseOver() {
    if (this.mainController.fadeTimeout) {
      clearTimeout(this.mainController.fadeTimeout);
    }
    this.mainController.showPanels();
    this.mainController.fadeTimeout = setTimeout(() => {
      this.mainController.hidePanels();
    }, 1000);
  }

  handleMouseOut() {
    this.mainController.hidePanels();
  }

  handleMouseMove() {
    if (this.mainController.fadeTimeout) {
      clearTimeout(this.mainController.fadeTimeout);
    }
    this.mainController.showPanels();
    this.mainController.fadeTimeout = setTimeout(() => {
      this.mainController.hidePanels();
    }, 1000);
  }

  handleMouseLeave() {
    if (this.mainController.fadeTimeout) {
      clearTimeout(this.mainController.fadeTimeout);
    }
    this.mainController.hidePanels();
  }
}

// Initialize the controller
const playbackController = new PlaybackSpeedController();

// Notify background script
chrome.runtime.sendMessage('show_page_action');
