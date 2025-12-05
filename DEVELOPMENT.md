# YouTube Playback Speed Control - Development Guide

## Project Structure

```
youtube-playback-speed-control/
├── css/
│   ├── inject.css              # Styles injected into web pages
│   └── smart-green.css         # Options page styles
├── fonts/                      # Font files
├── icons/                      # Extension icons
│   ├── icon16.png
│   ├── icon19.png
│   ├── icon48.png
│   └── icon128.png
├── lib/                        # Third-party libraries
│   ├── bootstrap/
│   └── jquery/
├── src/
│   ├── background.js           # Service worker (Manifest V3)
│   ├── inject/
│   │   └── inject.js          # Content script for video control
│   └── option/
│       ├── options.html        # Options page UI
│       ├── options.js          # Options page logic
│       └── keycodedict.json    # Keyboard key mappings
├── manifest.json               # Extension manifest
├── README.md                   # User documentation
├── CHANGELOG.md               # Version history
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT License
├── SECURITY.md               # Security policy
└── .gitignore                # Git ignore rules
```

## Core Components

### 1. Content Script (`src/inject/inject.js`)

**Purpose**: Injected into web pages to control video playback

**Key Classes**:
- `PlaybackSpeedController`: Main controller managing the entire extension
- `VideoController`: Manages individual video elements

**Key Features**:
- Detects video elements using MutationObserver
- Handles keyboard shortcuts
- Manages mouse wheel control
- Creates and positions on-screen controls
- Tracks time saved
- Syncs with Chrome storage

### 2. Background Script (`src/background.js`)

**Purpose**: Service worker handling extension lifecycle and messages

**Responsibilities**:
- Handle extension icon clicks
- Process messages from content scripts
- Open options page when requested

### 3. Options Page (`src/option/options.js`)

**Purpose**: User settings interface

**Features**:
- Save/restore user preferences
- Validate input
- Display time saved statistics
- Populate keyboard shortcut dropdowns
- Handle donation popup interactions

## Development Workflow

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/youtube-playback-speed-control.git
cd youtube-playback-speed-control

# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the extension directory
```

### Making Changes

1. **Edit code** in your preferred editor
2. **Reload extension**:
   - Go to `chrome://extensions/`
   - Click the reload icon for the extension
3. **Test changes**:
   - Navigate to YouTube or any video site
   - Test functionality
   - Check console for errors (F12)

### Testing Checklist

- [ ] YouTube videos (regular page)
- [ ] YouTube embedded videos
- [ ] Other HTML5 videos (if enabled)
- [ ] Keyboard shortcuts work
- [ ] Mouse wheel control works
- [ ] Options page saves settings
- [ ] Display options work correctly
- [ ] Fullscreen mode works
- [ ] Multiple videos on one page
- [ ] Time saved tracking works
- [ ] Console has no errors

## Code Style

### JavaScript

```javascript
// Use modern ES6+ syntax
class MyClass {
  constructor() {
    this.property = 'value';
  }

  async myMethod() {
    const result = await this.asyncOperation();
    return result;
  }
}

// Use arrow functions for callbacks
element.addEventListener('click', (event) => {
  this.handleClick(event);
});

// Use const/let, never var
const permanent = 'value';
let variable = 'value';

// Destructuring
const { speed, speedStep } = this.settings;

// Template literals
const message = `Speed is now ${speed}x`;
```

### CSS

```css
/* Use modern CSS features */
.element {
  /* Logical properties */
  display: flex;
  
  /* Modern syntax */
  border-radius: 5px;
  
  /* Transitions */
  transition: all 0.15s ease;
}

/* Media queries for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none;
  }
}
```

## Chrome Extension APIs Used

### chrome.storage.sync

```javascript
// Save settings
await chrome.storage.sync.set({ speed: 1.5 });

// Load settings
const items = await chrome.storage.sync.get({ speed: 1.0 });
```

### chrome.runtime

```javascript
// Send message
chrome.runtime.sendMessage({ action: 'openOptionsPage' });

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle message
});

// Open options page
chrome.runtime.openOptionsPage();
```

## Debugging Tips

### Console Logs

```javascript
// Content script logs appear in page console (F12)
console.log('Content script loaded');

// Background script logs appear in extension console
// (chrome://extensions/ -> Details -> Inspect views: service worker)
console.log('Background script loaded');
```

### Common Issues

1. **Extension not loading**:
   - Check manifest.json syntax
   - Check for JavaScript errors
   - Verify file paths

2. **Changes not appearing**:
   - Reload extension at chrome://extensions/
   - Hard reload page (Ctrl+Shift+R)
   - Clear cache

3. **Keyboard shortcuts not working**:
   - Check if another extension uses same keys
   - Verify keyCode values in keycodedict.json
   - Check if input field is focused

4. **Controls not appearing**:
   - Check CSS z-index
   - Verify display option setting
   - Check if site-specific CSS conflicts exist

## Performance Considerations

- Use MutationObserver efficiently (disconnect when not needed)
- Debounce frequent operations
- Use event delegation where possible
- Clean up event listeners
- Avoid excessive DOM queries

## Building for Distribution

```bash
# Remove development files
# Zip the extension directory
# Upload to Chrome Web Store
```

### Files to Exclude from Distribution

- `.git/`
- `node_modules/` (if any)
- `.vscode/`
- `*.md` files (except README if needed)
- `.gitignore`

## Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

## Getting Help

- Open an issue on GitHub
- Check existing issues for similar problems
- Read Chrome extension documentation
- Ask in Chrome extension developer forums

## License

MIT License - See LICENSE file for details
