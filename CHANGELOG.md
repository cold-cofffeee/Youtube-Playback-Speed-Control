# Changelog

All notable changes to YouTube Playback Speed Control will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-06

### 🎉 Major Refactor Release

This release represents a complete modernization of the extension with improved code quality, performance, and maintainability.

### Added
- Modern ES6+ class-based architecture
- Comprehensive code documentation and comments
- Better error handling and logging
- Improved accessibility features (keyboard navigation, screen reader support)
- Enhanced CSS with smooth transitions and animations
- Support for reduced motion preferences
- High contrast mode support
- Professional README with detailed documentation
- CONTRIBUTING.md with development guidelines
- MIT License
- .gitignore for better repository management
- Comprehensive CHANGELOG

### Changed
- **Complete code refactor**: Rewrote all JavaScript files with clean, maintainable code
- **Improved performance**: Optimized DOM operations and event handling
- **Better UX**: Smoother animations and transitions
- **Modernized CSS**: Removed vendor prefixes, added modern properties
- **Updated manifest**: Cleaned up and organized for Manifest V3
- **Enhanced options page**: Better UI/UX with improved validation
- Removed dependency on external update URL

### Fixed
- Memory leaks from improper event listener cleanup
- Race conditions in video detection
- Inconsistent speed indicator updates
- Fullscreen mode display issues
- Mouse wheel scroll conflicts
- Input field interference with keyboard shortcuts

### Technical Improvements
- Used MutationObserver for efficient video element detection
- Implemented proper async/await patterns
- Added Map for tracking video controllers
- Improved Chrome Storage API usage
- Better separation of concerns with class-based design
- Enhanced type safety with JSDoc comments

---

## [0.0.15] - Previous Release

### Fixed
- Fixed an issue reported by users after Chrome update Version 127
- Version 0.0.14 didn't fully fix the issue

## [0.0.14]

### Fixed
- Fixed an issue reported by users after Chrome update Version 127
- Wasn't fully able to replicate the issue but fixed the error that appeared in console

## [0.0.13]

### Added
- Allow the extension to work with all HTML5 video
- Added option to disable it if needed
- Updated Bootstrap & jQuery

## [0.0.12]

### Fixed
- Fixed issue with playback button remaining on full screen even with FadeInFadeOut option

## [0.0.11]

### Fixed
- Fixed bug that breaks the playback button display when switching full screen and back

## [0.0.10]

### Fixed
- Fixed major bug of playback button not showing up sometimes

## [0.0.9]

### Changed
- Updated to Manifest v3 required by Extension development

## [0.0.8]

### Added
- Added option to hide setting button

## [0.0.7]

### Changed
- Removed webRequest permission
- Easy access to setting page
- Changes to comply with Chrome Web Store

## [0.0.6]

### Added
- Added more control over position of playback rate increase/decrease button
- Added TopLeft, TopMiddle, TopRight, BottomLeft, BottomMiddle, BottomRight position options
- Added option to view time saved using this extension in option page

### Fixed
- Removed the need to access to full browser history
- Fixed shortcut assigned for speed up and down not being taken into account and reset to "0"
- Fixed extension overlay from preventing "press x to close" when in miniplayer mode
- Fixed hotkeys triggering when typing in comments

## [0.0.5]

### Added
- Added option to disable Shift+MouseScroll combination
- Shows the speed control for 300 milliseconds when the speed is changed

## [0.0.4]

### Added
- Added reset playback speed to 1x feature (default: '*')
- Added increase or decrease of playback speed using Shift+MouseScroll combination
- Added 'Up Arrow' and 'Down Arrow' to key options (user request)

## [0.0.3]

### Added
- Supports user defined playback rate increment
- Added more speed options with higher playback rate support

### Changed
- Made extension more stable - loads successfully every time
- Made the extension work with embedded videos almost all the time

### Fixed
- Fixed bug with playlist not advancing to next video
- Fixed bug of comments not loading sometimes

## [0.0.2]

### Added
- User friendly display of the playback rate
- Added increase/decrease buttons
- Added various mode of playback rate display (Always, Hide/Show, Simple, None)

### Fixed
- Fixed bug of '+' and '-' buttons next to backspace not working
- Only Numeric keypad '+' and '-' was working before

## [0.0.1] - Initial Release

### Added
- Basic functionality of changing YouTube playback rate using keyboard
- Keyboard shortcuts for speed control
- Visual speed indicator

---

## Upgrade Guide

### From 0.0.15 to 1.0.0

This is a major refactor with no breaking changes for users. All your settings will be preserved.

**What's New:**
- Much cleaner, more maintainable code
- Better performance and reliability
- Improved accessibility
- Enhanced visual feedback
- Better error handling

**Action Required:**
- No action required - just enjoy the improvements!

---

## Support

- Report bugs: [GitHub Issues](https://github.com/yourusername/youtube-playback-speed-control/issues)
- Feature requests: [GitHub Discussions](https://github.com/yourusername/youtube-playback-speed-control/discussions)

---

[1.0.0]: https://github.com/yourusername/youtube-playback-speed-control/releases/tag/v1.0.0
