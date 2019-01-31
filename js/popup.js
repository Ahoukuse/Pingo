class View {
  constructor(ViewName,ViewLocal) {
    this.ViewName = ViewName;
    this.ViewLocal = ViewLocal;
  }
  Init(){
    console.log(this.ViewName+" Init...");
  }
  Onactivity(){
    console.log(this.ViewName+" activity...");
  }
  Quit(){
    console.log(this.ViewName+" Quit...");
  }
}
class MainListView extends View {
  constructor(ViewName,ViewLocal,Root) {
    super(ViewName,ViewLocal);
    this.Root = Root;
    this.ItemArray = [];
  }
  CreateItem(object) {
    this.ItemArray.push(object);
  }
  Init(){
    var pre = $("#"+this.Root);
    pre.css("display","block");
    for (var i = 0; i < this.ItemArray.length; i++) {
      //let View = $("#"+ViewArray[i].ViewLocal);
      let Pointer = this.ItemArray[i];
      let PointerO = $("#"+Pointer.ViewName);
      if(PointerO.length == 0) {
        let prediv = $("<div></div>");
        let element = $("<p></p>");
        element.text(Pointer.Context);
        element.attr("id",Pointer.ViewName);
        element.appendTo(prediv);
        prediv.appendTo(pre);
        $("#"+Pointer.ViewName).on("click",{"initor":Pointer.Init,"divlocal":Pointer.ViewLocal},function(event){
          event.data.initor();
          pre.css("display","none");
          $("#"+event.data.divlocal).css("display","block");
        });
      }
      else {
        PointerO.text(Pointer.Context);
      }
    }
  }
}

class LogView extends View {
  constructor(ViewName,ViewLocal){
    super(ViewName,ViewLocal);
  }
  Init(){
    $("#"+this.ViewLocal).css("display","inline");
    $("#loginbtn").on("click",{"view":this.ViewLocal},function(event){
      var xhr = new XMLHttpRequest();
      xhr.open("POST","https://api.ahhhh.com.cn/login",true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send("username="+$("#username").val()+"&password="+$("#password").val());
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var res = JSON.parse(xhr.responseText);
          if (res["status"]=="200") {
            chrome.storage.sync.set({"username":res["user"]["username"],"img":res["user"]["img"],"id":res["user"]["id"]},function () {
                  $("#LogView").css("display","none");
                  let user = new userView("user-view","userdash",res["user"]["username"]);
                  let MainList = new MainListView("MainList","MainList","list");
                  MainList.CreateItem(user);
                  MainList.Init();
              });
          }
        }
      };
    });
    $("#signin").on("click",function (){
      chrome.tabs.create({"url":"https://api.weibo.com/oauth2/authorize?client_id=3627404072&redirect_uri=https://ahhhh.com.cn/pingo/signin"});
    });
  }
}

class userView extends View {
  constructor(ViewName,ViewLocal,Context){
    super(ViewName,ViewLocal);
    this.Context = Context;
  }
  Init(){
    chrome.storage.sync.get(['username',"img"], function(result){
      $("#usernamelabel").text(result["username"]);
      $("#usericon").attr("src",result["img"]);
    });
    $("#logout").on("click",{"view":this.ViewLocal},function (event) {
      chrome.storage.sync.remove(["username","id"]);
      $("#userdash").css("display","none");
      chrome.storage.sync.get(['username'], function(result) {
        reflashList(result);
      });
    });
    $("#black-btn").on("click",{"view":this.ViewLocal},function (event) {
      console.log(event.data);
      $("#userdash").css("display","none");
      chrome.storage.sync.get(['username'], function(result) {
        reflashList(result);
      });
    });
  }
  Quit(){

  }
}

function reflashList(result) {
  if (result["username"]===undefined) {
    let logview = new LogView("logview","LogView");
    logview.Init();
  }
  else{
    let user = new userView("user-view","userdash",result["username"]);
    let MainList = new MainListView("MainList","MainList","list");
    MainList.CreateItem(user);
    MainList.Init();
  }
}

$(function(){
  chrome.storage.sync.get(['username'],function(result) {
    reflashList(result)
  });
});
