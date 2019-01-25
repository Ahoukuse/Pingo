$(function () {
  chrome.storage.sync.get(['isFuzzy'],function(result) {
    if (result["isFuzzy"] === undefined) {
      document.getElementById('verbOff').checked = true;
    }
    else{
      if (result["isFuzzy"]) {
        document.getElementById('verbOn').checked = true;
      }
      else {
        document.getElementById('verbOff').checked = true;
      }
    }
  });
  $("#save").on("click",function () {
    if (document.getElementById('verbOn').checked) {
      chrome.storage.sync.set({"isFuzzy":true});
    }
    else {
      chrome.storage.sync.set({"isFuzzy":false});
    }
  });
});
