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
    for (var i = 0; i < this.ItemArray.length; i++) {
      //let View = $("#"+ViewArray[i].ViewLocal);
      let Pointer = this.ItemArray[i];
      let prediv = $("<div></div>");
      let element = $("<p></p>");
      element.html(Pointer.ViewName);
      element.attr("id",Pointer.ViewName);
      element.appendTo(prediv);
      prediv.appendTo(pre);
      $("#"+Pointer.ViewName).on("click",{"initor":Pointer.Init,"divlocal":Pointer.ViewLocal},function(event){
        event.data.initor();
        pre.css("display","none");
        $("#"+event.data.divlocal).css("display","block");
      });
    }
  }
}

class testView extends View {
  constructor(ViewName,ViewLocal){
    super(ViewName,ViewLocal)
  }
  Init(){
  }
}
$(function(){
  chrome.tabs.getSelected(null, function (tab) {
        console.log(tab.url);
  });
  let test = new testView("test","test");
  let MainList = new MainListView("MainList","MainList","list");
  MainList.CreateItem(test);
  MainList.Init();
});
