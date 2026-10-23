// Chrome Extension Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Viva-Bachao Extension installed successfully.');
});

// Listen for tab updates to update action badge if visiting github.com
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes('github.com/')) {
    chrome.action.setBadgeText({ tabId, text: 'VIVA' });
    chrome.action.setBadgeBackgroundColor({ tabId, color: '#1d4ed8' });
  } else {
    chrome.action.setBadgeText({ tabId, text: '' });
  }
});
