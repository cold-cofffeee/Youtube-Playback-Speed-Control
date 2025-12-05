/**
 * YouTube Playback Speed Control - Background Script
 * Handles extension icon clicks and opens options page
 */

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message) return;

  // Handle page action display (legacy support)
  if (message === 'show_page_action' || message.msg === 'show_page_action') {
    // In Manifest V3, page actions are deprecated
    // Extension icon is always visible
    return;
  }

  // Handle action requests
  if (message.action) {
    switch (message.action) {
      case 'openOptionsPage':
        openOptionsPage();
        break;
      default:
        console.warn('Unknown action:', message.action);
    }
  }
});

// Handle extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Open options page when extension icon is clicked
  openOptionsPage();
});

/**
 * Opens the extension options page
 */
function openOptionsPage() {
  chrome.runtime.openOptionsPage();
}

// Initialize extension
console.log('YouTube Playback Speed Control extension loaded');
