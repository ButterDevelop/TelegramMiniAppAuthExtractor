// Listen for when a web page finishes loading
chrome.webNavigation.onCompleted.addListener(function(details) {
  // Check if the loaded page URL contains 'web.telegram.org'
  if (details.url.includes('web.telegram.org')) {
    // Send a message to the background script to set the extension icon
    chrome.runtime.sendMessage({ action: "setIcon", iconPath: "images/icon48.png" });
    // Send a message to the content script in the tab to check for mini app authentication
    chrome.tabs.sendMessage(details.tabId, { action: "checkMiniAppAuth" });
  }
}, { url: [{ urlMatches: 'web.telegram.org' }] });

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Check if the action in the received message is "setIcon"
  if (request.action === "setIcon") {
    // Update the extension's icon using the provided icon path
    chrome.action.setIcon({ path: request.iconPath });
  }
  // Return true to indicate that the response is asynchronous
  return true;
});
