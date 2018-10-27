chrome.runtime.onMessage.addListener(function(msg,sender,sq){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {"website":tabs[0].url});
  });
});
//
