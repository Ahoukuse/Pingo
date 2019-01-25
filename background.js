chrome.runtime.onMessage.addListener(function(msg,sender,sq){
  chrome.storage.sync.get(["isFuzzy"],function(result){
    if (result["isFuzzy"]===undefined){
      console.log("初始化Fuzzy");
      chrome.storage.sync.set({"isFuzzy":true});
      result["isFuzzy"] = true;
    }
    if (result["isFuzzy"]) {
      console.log("模糊匹配模式");
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var url = tabs[0].url.match("https?://[\-_%.a-zA-Z0-9/]*")[0];
        console.log(url);
        chrome.tabs.sendMessage(tabs[0].id, {"website":url});
      });
    }
    else {
      console.log("非模糊匹配模式");
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(tabs[0].url);
        chrome.tabs.sendMessage(tabs[0].id, {"website":tabs[0].url});
      });
    }
  });
});
chrome.storage.sync.get(["notificode"],function (result) {
  if (result["notificode"]===undefined) {
    console.log("notificode is undefined");
    //http://localhost:2333/notif?timestamp=1544494558.224312
    var timestamp=new Date();
    timestamp = timestamp/1000;
    chrome.storage.sync.set({"notificode":timestamp});
  }
  else {
    console.log("notificode is defined");
    console.log("value is "+result["notificode"]);
    var xhr = new XMLHttpRequest();
    xhr.open("GET","https://api.ahhhh.com.cn/notif?timestamp="+result["notificode"],true);
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhr.responseText);
        if (res["notif"].length != 0) {
          chrome.storage.sync.set({"notificode":res["notif"][0]["timestamp"]+1});
          for (var i = 0; i < res["notif"].length; i++) {
            chrome.notifications.create({"type":"basic",
                                      "iconUrl":chrome.runtime.getURL("/img/toys.png"),
                                      "message":res["notif"][i]["mesg"],
                                      "title":res["notif"][i]["title"]});
          }
        }
        else {
          console.log("not notif");
        }
      }
    };
    xhr.send();
  }
});
