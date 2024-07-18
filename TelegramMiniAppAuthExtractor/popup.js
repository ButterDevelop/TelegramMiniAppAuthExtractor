// Function to set the authorization string in the popup
function setAuthString(auth) {
  // Get the element where the authorization string will be displayed
  const authStringElement = document.getElementById('authString');
  
  // Check if the element exists
  if (authStringElement) {
    // Update the text content of the element
    authStringElement.textContent = auth ? "Authorization string: " + auth : "No authorization string found.";
  }
}

// Event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get references to the buttons and authorization string element
  const checkAuthButton = document.getElementById('checkAuthButton');
  const copyAuthButton = document.getElementById('copyAuthButton');
  const authStringElement = document.getElementById('authString');

  // Add click event listener to the 'Check' button
  checkAuthButton.addEventListener('click', function() {
    // Query the currently active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      // Send a message to the content script in the active tab to check for the mini app auth
      chrome.tabs.sendMessage(tabs[0].id, { action: "checkMiniAppAuth" });
    });
  });
  
  // Add click event listener to the 'Copy' button
  copyAuthButton.addEventListener('click', function() {
    // Get the text content of the authorization string element
    let authString = authStringElement.textContent.trim();
    
    // Check if the authorization string contains the substring "Authorization string: "
    if (authString.includes("Authorization string: ")) {
      // Remove the substring "Authorization string: " from the string
      let authOnly = authString.replace("Authorization string: ", "");
  
      // Copy the text (without the substring) to the clipboard
      navigator.clipboard.writeText(authOnly).then(() => {
        // Visual confirmation of copying
        copyAuthButton.textContent = 'Copied!';
        // Reset the button text after 1.5 seconds
        setTimeout(function() {
          copyAuthButton.textContent = 'Copy';
        }, 1500);
      }, () => {
        // Alert if copying fails
        alert('Failed to copy authorization string.');
      });
    }
  });
});

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Check if the action in the message is "authString"
  if (request.action === "authString") {
    // Call the function to update the authorization string display
    setAuthString(request.auth);
  }
});
