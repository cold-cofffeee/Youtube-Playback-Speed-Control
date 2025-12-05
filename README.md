# YouTube Playback Speed Control

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://chrome.google.com/webstore)

A powerful Chrome extension that allows you to control video playback speed on YouTube and other HTML5 video players using convenient keyboard shortcuts and mouse controls.

## 🚀 Features

- **⌨️ Keyboard Shortcuts**: Increase, decrease, or reset playback speed with customizable hotkeys
- **🖱️ Mouse Wheel Control**: Use Shift+MouseWheel to adjust speed on the fly
- **🎯 Customizable Speed Steps**: Set your preferred speed increment (default: 0.25x)
- **📺 Multiple Video Support**: Works with YouTube and all HTML5 video players
- **💾 Remember Speed**: Optionally remember your preferred playback speed across videos
- **🎨 Flexible Display Options**: 
  - Always visible
  - Show/hide on hover
  - Simple display
  - Hidden mode
- **📍 Adjustable Position**: Place speed control in any corner of the video
- **⏱️ Time Saved Tracker**: See how much time you've saved by watching at higher speeds
- **🌐 Embedded Videos**: Works on embedded YouTube players across the web

## 📦 Installation

### From Chrome Web Store (Recommended)
*Coming soon - Link will be added after publishing*

### Manual Installation (For Development)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/youtube-playback-speed-control.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

5. The extension icon should appear in your Chrome toolbar

## 🎮 Usage

### Default Keyboard Shortcuts

- **`+`** or **`=`** : Increase playback speed
- **`-`** or **`_`** : Decrease playback speed
- **`*`** (Numpad) : Reset to 1x speed
- **`Shift + Mouse Wheel`** : Adjust speed with mouse

### On-Screen Controls

The extension adds a small control panel to videos with buttons for:
- **`>>`** : Increase speed
- **Current Speed** : Click to reset to 1x
- **`<<`** : Decrease speed
- **⚙️** : Open settings page

### Customization

Click the extension icon or the settings button on the video player to:

- **Customize keyboard shortcuts**: Choose your preferred keys
- **Adjust speed increment**: Set how much speed changes per keypress
- **Display options**: Choose how and when the control panel appears
- **Panel position**: Place controls where you prefer on the video
- **Enable/disable features**: Mouse wheel control, remember speed, etc.
- **All videos mode**: Enable for non-YouTube HTML5 videos (Beta)

## 🛠️ Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| Speed Step | Amount to increase/decrease speed | 0.25 |
| Slower Key | Key to decrease speed | - (Minus) |
| Faster Key | Key to increase speed | + (Plus) |
| Reset Key | Key to reset to 1x | * (Asterisk) |
| Display Option | Panel visibility mode | Hide/Show |
| Display Position | Location of control panel | Top Right |
| Mouse Wheel | Enable Shift+Wheel control | Enabled |
| Remember Speed | Keep speed across videos | Disabled |
| Hide Settings | Hide settings button | Disabled |
| All Videos | Work on all HTML5 videos | Enabled |

## 📊 Technical Details

### Architecture

- **Manifest V3**: Built with the latest Chrome extension standards
- **Modern JavaScript**: ES6+ classes, async/await, and clean code patterns
- **Efficient DOM Handling**: MutationObserver for dynamic video detection
- **Chrome Storage API**: Synced settings across devices
- **Content Scripts**: Injected into web pages for seamless integration

### Browser Compatibility

- Chrome 88+
- Microsoft Edge 88+ (Chromium-based)
- Other Chromium-based browsers

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/yourusername/youtube-playback-speed-control/issues) with:

- Browser version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## 💖 Support the Project

If you find this extension useful, consider:

- ⭐ Starring the repository
- 🐦 Sharing with friends
- 💬 Leaving a review on the Chrome Web Store
- ☕ [Buying me a coffee](https://paypal.me/yourpaypal)

### Donations

- **PayPal**: [Donate via PayPal](https://www.paypal.com/donate)
- **Venmo**: @Pujan-Shrestha
- **BTC**: `3BUuoWs14Rmte9bKuFNima3sGCafjowmfF`
- **LTC**: `MVsANoKbgubgzDkcd22JnZaWmZidkWaUwV`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original concept inspired by YouTube's native speed control
- Icons and design elements created for this project
- Thanks to all contributors and users for feedback and support

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/youtube-playback-speed-control/issues)
- **Email**: your.email@example.com
- **Website**: https://yourwebsite.com

---

**Note**: This extension is not affiliated with or endorsed by YouTube or Google.

Made with ❤️ by [Your Name](https://github.com/yourusername)
