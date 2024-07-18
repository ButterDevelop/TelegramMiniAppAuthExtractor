// Listen for incoming messages from other parts of the extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Check if the action in the message is "checkMiniAppAuth"
  if (request.action === "checkMiniAppAuth") {
    // Call the function to check for mini app authentication
    checkMiniAppAuth();
  }
});

// Function to check for mini app authentication
function checkMiniAppAuth() {
  // Get all iframe elements on the page
  let iframes = document.getElementsByTagName('iframe');
  // Iterate through each iframe
  for (let iframe of iframes) {
    // Get the 'src' attribute of the iframe
    let src = iframe.getAttribute('src');
    // Check if the 'src' contains the specific parameter '#tgWebAppData'
    if (src && src.includes('#tgWebAppData')) {
      // Find the start and end positions of the authorization string within the 'src'
      let startIndex = src.indexOf('#tgWebAppData=') + '#tgWebAppData='.length;
      let endIndex = src.indexOf('&tgWebAppVersion');
      
      // Ensure that both indices are valid and the end index is greater than the start index
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        // Extract and decode the authorization string from the 'src'
        let auth = decodeURIComponent(src.substring(startIndex, endIndex));
        
        // Send the authorization string to the background script
        chrome.runtime.sendMessage({ action: "authString", auth: auth });
        // Update the extension icon to indicate active status
        chrome.runtime.sendMessage({ action: "setIcon", iconPath: "images/icon48_active.png" });
      }
    }
  }
}
