String.prototype.makeit = function() {
    var maxlen = 20;
    var len = 0;
    var index = 0;
    for (; index<this.length; index++) {
        if (this.charCodeAt(index)>127 || this.charCodeAt(index)==94) {
             len += 2;
         } else {
             len ++;
         }
         if (len >= maxlen) {
           break;
         }
     }
     if (index == this.length) {
       return this
     }
     else {
       return this.substr(0,index)+"...";
     }

}
function reflashCommentBox(commentbox,islogin,website,userid=undefined,page=1,add=false) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(xhr.responseText);
      commentbox.attr("data",page);
      console.log(res);
      if (!add) {
        commentbox.empty();
      }
      if (res["status"]=="200") {
        if (res["comment"].length == 0) {
          $("#Aho-commentbox").off("scroll");
        }
        for (var i = 0; i < res["comment"].length; i++) {
          addComment(commentbox,islogin,res["comment"][i]["user"],res["comment"][i]["context"],res["comment"][i]["likenumb"],res["comment"][i]["ObjectId"],res["comment"][i]["likestaus"]);
        }
      }
      else if (res["status"]=="404") {
        var notfound = $("<p class='Aho-warning-text'>啥都没得...</p>");
        notfound.appendTo(commentbox);
      }
    }
  };
  chrome.storage.sync.get(["id"],function (result) {
    var url = "https://api.ahhhh.com.cn/getcomment?website="+website+"&userid="+result["id"]+"&page="+page
    xhr.open("GET",url, true);
    console.log(url);
    xhr.send();
  });
}
function addComment(commentbox,islogin,username,context,likenumb,objectid,likestaus) {
  username = username.makeit();
  var svgicon = $("<svg width='50' height='50'><rect x='0' y='0' rx='10' ry='10' width='50' height='50' style='fill:blue;stroke:black;stroke-width:1;opacity:0.4'/>你的浏览器还不支持SVG</svg>");
  var likeicon = $("<div class='Aho-like'></div>");
  var likedicon = $("<div class='Aho-like Aho-liked'></div>");
  //var likedicon = $("<img class='Aho-votebtn' src='https://png.icons8.com/ios/50/666666/sort-up-filled.png'></img>");
  var unlikeicon = $("<div class='Aho-unlike'></div>");
  var unlikedicon = $("<div class='Aho-unlike Aho-unliked'></div>");

  //var unlikedicon = $("<img class='Aho-votebtn' src='https://png.icons8.com/ios/50/666666/sort-down-filled.png'></img>");
  var likenumber = $("<p class='Aho-likenumber'></p>");
  var comment = $("<div class='Aho-comment'><div class='Aho-profileimg'></div><div class='Aho-comment-context'><div class='Aho-username'><p class='Aho-username-p'></p></div><div class='Aho-comment'><p class='Aho-comment-p'></p></div></div><div class='Aho-comment-vote'></div></div>")
  comment.attr("id",objectid);
  comment.children(".Aho-comment-context").children(".Aho-username").children(".Aho-username-p").text(username);
  comment.children(".Aho-comment-context").children(".Aho-comment").children(".Aho-comment-p").text(context);
  likenumber.text(likenumb);
  svgicon.prependTo(comment.children(".Aho-profileimg"));
  if (likestaus == 0) {
    unlikeicon.prependTo(comment.children(".Aho-comment-vote"));
    likenumber.prependTo(comment.children(".Aho-comment-vote"));
    likeicon.prependTo(comment.children(".Aho-comment-vote"));
  }
  else if (likestaus < 0) {
    unlikedicon.prependTo(comment.children(".Aho-comment-vote"));
    likenumber.prependTo(comment.children(".Aho-comment-vote"));
    likeicon.prependTo(comment.children(".Aho-comment-vote"));
  }
  else if (likestaus > 0) {
    unlikeicon.prependTo(comment.children(".Aho-comment-vote"));
    likenumber.prependTo(comment.children(".Aho-comment-vote"));
    likedicon.prependTo(comment.children(".Aho-comment-vote"));
  }
  comment.appendTo(commentbox);
  if (islogin) {
    $("#"+objectid+" .Aho-comment-vote .Aho-like").on("click",onlike);
    $("#"+objectid+" .Aho-comment-vote .Aho-unlike").on("click",onunlike);
  }
}
class SideView {
  constructor(website,islogin) {
    this.website = website
    this.islogin = islogin
    this.sideview = $("<div></div>");
    this.sidebtn = $("<div></div>");
    var sendbox = $("<div></div>");
    var commentbox = $("<div></div>");
    var sendbtn = $("<button id='Aho-btn-send'type='button' name='Aho-btn-send'>咻咻！</button>");
    var textarea = $("<div id='Aho-textarea' ><br></div>");
    var icon = $("<img></img>");
    sendbtn.attr("data",website);
    sendbox.attr("id","Aho-sendbox");
    commentbox.attr("id","Aho-commentbox");
    icon.attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAClSURBVGhD7dgxCsJAEIXhvYCIN7DMtay8n1ew09oz5BZJ3qDbWLruZmb4P3gQLAI/JEi2AAAANJm0y/syLouYtUW72g8R1Yj1s7AxN61GhI45ag+NGG/SxTw1YrwhxquuMQftNHBn7aX9Peaufd90rzXFeAqx/RxDSIc1PVppXvaRUvyXEOEFEV5YRPgPKyI8SXMclOaAzqQ4Mq1SHGIDAIB+StkAJOghMA+chuMAAAAASUVORK5CYII=")
    this.sidebtn.css("background-color","white");
    this.sidebtn.css("position","fixed");
    this.sidebtn.css("width","50px");
    this.sidebtn.css("cursor","pointer");
    this.sidebtn.css("z-index","19999");
    this.sidebtn.css("top","450px");
    this.sidebtn.css("left","0px");
    this.sidebtn.attr("id","Aho-sidebtn");
    this.sideview.css("height","100%");
    this.sideview.css("width","400px");
    this.sideview.css("top","0px");
    this.sideview.css("left","-400px");
    this.sideview.css("position","fixed");
    this.sideview.css("z-index","19998");
    this.sideview.attr("id","Aho-sideview");
    commentbox.prependTo(this.sideview);
    sendbox.prependTo(this.sideview);

    this.sidebtn.on("click",function () {
      if ($("#Aho-sidebtn").attr("data") == "open") {
        $("#Aho-sideview").animate({left:"-400px"});
        $("#Aho-sidebtn").animate({left:"0px"});
        $("#Aho-sidebtn").children("img").css("transform","rotate(0deg)");
        $("#Aho-sidebtn").attr("data","close");
      }
      else{
        $("#Aho-sideview").animate({left:"0px"});
        $("#Aho-sidebtn").animate({left:"399px"});
        $("#Aho-sidebtn").children("img").css("transform","rotate(180deg)");
        $("#Aho-sidebtn").attr("data","open");
      }
    });

    commentbox.on("scroll",function () {
      var currentpage =Number($(this).attr("data"));
      if ($(this).scrollTop() > currentpage*300) {
        var page = currentpage + 1;
        $(this).attr("data",page);
        chrome.storage.sync.get(["id"],function (result) {
          reflashCommentBox($("#Aho-commentbox"),islogin,website,result["id"],page,true);

        });
      }
    });

    if (islogin) {
      textarea.addClass("Aho-textarea");
      sendbtn.addClass("Aho-btn-send");
      textarea.attr("contentEditable","true");
      sendbtn.on("click",function () {
        var website =  $(this).attr("data");
        var xhr = new XMLHttpRequest();
        var context = $("#Aho-textarea").text();
        xhr.open("POST","https://api.ahhhh.com.cn/sendcomment",true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(xhr.responseText);
            console.log(res);
            reflashCommentBox($("#Aho-commentbox"),islogin,website);
          }
        };
        if (context != "") {
          $("#Aho-textarea").html("<br>");
          chrome.storage.sync.get(["id"],function (result) {
            let sendmsg = "userid="+result["id"]+"&website="+website+"&context="+context
            console.log(sendmsg);
            xhr.send(sendmsg);
          });
        }
      });
    }
    else {
      //未登录行为在此定义
      textarea.attr("contentEditable","false");
      textarea.addClass("Aho-textarea-baffle");
      textarea.html("<p class='Aho-forbidden'>请先登录<p>");
      sendbtn.addClass("Aho-sendbtn-forbidden");
    }

    sendbtn.prependTo(sendbox);
    textarea.prependTo(sendbox);


    icon.prependTo(this.sidebtn);


  }
  showOn(position) {
    this.sideview.prependTo(position);
    this.sidebtn.prependTo(position);
    reflashCommentBox($("#Aho-commentbox"),this.islogin,this.website);
  }
}
function vote(commentid,likestaus,value) {
  $("#"+commentid+" .Aho-comment-vote p").text(Number($("#"+commentid+" .Aho-comment-vote p").text())+value);
  var slike = new XMLHttpRequest();
  slike.onreadystatechange = function(){};
  slike.open("POST","https://api.ahhhh.com.cn/vote",true);
  slike.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  chrome.storage.sync.get(["id"],function (result) {
    slike.send("commentid="+commentid+"&userid="+result["id"]+"&likestaus="+likestaus+"&value="+value);
  });
}
function onlike(){
  if ($(this).next().next().hasClass("Aho-unliked") && !$(this).hasClass("Aho-liked")){
    $(this).next().next().removeClass("Aho-unliked");
    var commentid = $(this).parent().parent().attr("id");
    vote(commentid,2,2);
  }
  else if(!$(this).next().next().hasClass("Aho-unliked") && $(this).hasClass("Aho-liked")){
    var commentid = $(this).parent().parent().attr("id");
    vote(commentid,0,-1);
  }
  else if(!$(this).next().next().hasClass("Aho-unliked") && !$(this).hasClass("Aho-liked")){
    var commentid = $(this).parent().parent().attr("id");
    vote(commentid,1,1);
  }
  $(this).toggleClass("Aho-liked");
}
function onunlike(){
  if ($(this).prev().prev().hasClass("Aho-liked") && !$(this).hasClass("Aho-unliked")){
    $(this).prev().prev().removeClass("Aho-liked");
    var commentid = $(this).parent().parent().attr("id");
    vote(commentid,-2,-2);
  }
  else if (!$(this).prev().prev().hasClass("Aho-liked") && $(this).hasClass("Aho-unliked")){
    var commentid = $(this).parent().parent().attr("id");
    vote(commentid,0,1);
  }
  else if(!$(this).prev().prev().hasClass("Aho-liked") && !$(this).hasClass("Aho-unliked")) {
    //send unlike this
    var commentid = $(this).parent().parent().attr("id");
    vote(commentid,-1,-1);
  }
  $(this).toggleClass("Aho-unliked");
}

$(function() {
  chrome.runtime.sendMessage({"code":"100"},function (response){});
  chrome.runtime.onMessage.addListener(function(msg,sender,sq){
    console.log(msg["website"]);
    chrome.storage.sync.get(["username"],function (result) {
      if (result["username"]===undefined) {
        var sv = new SideView(msg["website"],islogin=false);
      }
      else {
        var sv = new SideView(msg["website"],islogin=true);
      }
      sv.showOn($("body"));
    });
    //addComment("Ahoukuseeeee",msg["website"],"99");
  });
  //db.comment.insertOne({"user":{"username":"Rrt0"},"status":"000","context":"呀!","website":"https://ahhhh.com.cn/article/gv317992/","likenumber":"-1"})
  //db.comment.updateMany({"website":"https://ahhhh.com.cn/article/gv317992/"},{$set:{"website":"https://ahhhh.com.cn/article/gv317992"}})
});
