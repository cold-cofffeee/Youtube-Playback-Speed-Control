# Contributing to YouTube Playback Speed Control

Thank you for your interest in contributing to YouTube Playback Speed Control! We welcome contributions from everyone.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs **actual behavior**
- **Screenshots or videos** if applicable
- **Environment details**:
  - Browser version
  - Extension version
  - Operating system
  - Any error messages from the console

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case**: Why would this be useful?
- **Detailed explanation** of the proposed feature
- **Mockups or examples** if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**:
   - Follow the existing code style
   - Write clear, commented code
   - Test your changes thoroughly

3. **Commit your changes**:
   ```bash
   git commit -m "Add amazing feature"
   ```
   - Use present tense ("Add feature" not "Added feature")
   - Use imperative mood ("Move cursor to..." not "Moves cursor to...")
   - Keep commits focused and atomic

4. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**:
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/youtube-playback-speed-control.git
   cd youtube-playback-speed-control
   ```

2. **Load the extension in Chrome**:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension directory

3. **Make changes and test**:
   - After making changes, click the reload icon on `chrome://extensions/`
   - Test on YouTube and other video sites
   - Check the console for errors

## Code Style Guidelines

### JavaScript

- Use modern ES6+ syntax
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Add JSDoc comments for functions
- Use meaningful variable names
- Keep functions small and focused

```javascript
/**
 * Calculate the new playback speed
 * @param {number} currentSpeed - The current playback speed
 * @param {string} action - The action to perform ('faster', 'slower', 'reset')
 * @returns {number} The new playback speed
 */
function calculateNewSpeed(currentSpeed, action) {
  // Implementation
}
```

### CSS

- Use clear, descriptive class names
- Organize properties logically
- Add comments for complex styles
- Use modern CSS features
- Consider accessibility

### File Organization

```
src/
├── background.js      # Service worker
├── inject/
│   └── inject.js     # Content script
└── option/
    ├── options.html  # Options page
    └── options.js    # Options logic
```

## Testing

Before submitting a PR, test your changes:

1. **Functional testing**:
   - Test on YouTube videos
   - Test on embedded videos
   - Test keyboard shortcuts
   - Test mouse wheel control
   - Test options page

2. **Edge cases**:
   - Multiple videos on one page
   - Switching between videos
   - Fullscreen mode
   - Different video players

3. **Browser compatibility**:
   - Test in Chrome
   - Test in Edge (if possible)

## Documentation

- Update README.md if you change functionality
- Update CHANGELOG.md following the existing format
- Add inline comments for complex logic
- Update JSDoc comments if you modify function signatures

## Commit Messages

Follow these guidelines:

- **Format**: `Type: Brief description`
- **Types**:
  - `Feat:` New feature
  - `Fix:` Bug fix
  - `Docs:` Documentation changes
  - `Style:` Code style changes (formatting, etc.)
  - `Refactor:` Code refactoring
  - `Test:` Adding or updating tests
  - `Chore:` Maintenance tasks

**Examples**:
```
Feat: Add custom speed presets
Fix: Resolve speed reset issue on fullscreen
Docs: Update installation instructions
```

## Questions?

Feel free to open an issue with the `question` label if you need help or clarification.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
