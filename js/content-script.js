$(function() {

  var website = '';

  var body = $("body");
  var sideview = $("<div></div>");
  var sidebtn = $("<div></div>");
  var sendbox = $("<div></div>");
  var commentbox = $("<div></div>");
  var sendbtn = $("<button id='Aho-btn-send'type='button' name='Aho-btn-send'>咻咻！</button>");
  var textarea = $("<div id='Aho-textarea'><br></div>");
  var icon = $("<img></img>");

  sendbox.attr("id","Aho-sendbox");
  commentbox.attr("id","Aho-commentbox");
  icon.attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAClSURBVGhD7dgxCsJAEIXhvYCIN7DMtay8n1ew09oz5BZJ3qDbWLruZmb4P3gQLAI/JEi2AAAANJm0y/syLouYtUW72g8R1Yj1s7AxN61GhI45ag+NGG/SxTw1YrwhxquuMQftNHBn7aX9Peaufd90rzXFeAqx/RxDSIc1PVppXvaRUvyXEOEFEV5YRPgPKyI8SXMclOaAzqQ4Mq1SHGIDAIB+StkAJOghMA+chuMAAAAASUVORK5CYII=")
  sidebtn.css("background-color","white");
  sidebtn.css("position","fixed");
  sidebtn.css("width","50px");
  sidebtn.css("cursor","pointer");
  sidebtn.css("z-index","19999");
  sidebtn.css("top","450px");
  sidebtn.css("left","0px");
  sidebtn.attr("id","Aho-sidebtn");
  sideview.css("height","100%");
  sideview.css("width","400px");
  sideview.css("top","0px");
  sideview.css("left","-400px");
  sideview.css("position","fixed");
  sideview.css("z-index","19998");
  sideview.attr("id","Aho-sideview");
  sideview.prependTo(body);
  commentbox.prependTo(sideview);
  sendbox.prependTo(sideview);
  textarea.attr("contentEditable","true");
  sendbtn.prependTo(sendbox);
  $("#Aho-btn-send").on("click",function () {
    var website =  $(this).attr("data");
    var xhr = new XMLHttpRequest();
    var context = $("#Aho-textarea").text();
    $("#Aho-textarea").html("<br>");
    xhr.open("POST","https://api.ahhhh.com.cn/sendcomment",true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(xhr.responseText);
        console.log(res);
        reflashCommentBox($("#Aho-commentbox"),website);
      }
    };
    chrome.storage.sync.get(["id"],function (result) {
      let sendmsg = "userid="+result["id"]+"&website="+website+"&context="+context
      console.log(sendmsg);
      xhr.send(sendmsg);
    });
  });
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
  function reflashCommentBox(commentbox,website,userid=undefined,page=1,add=false) {
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
          for (var i = 0; i < res["comment"].length; i++) {
            addComment(res["comment"][i]["user"],res["comment"][i]["context"],res["comment"][i]["likenumb"],res["comment"][i]["ObjectId"],res["comment"][i]["likestaus"]);
          }
          $(".Aho-like").on("click",function(){
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
          });
          $(".Aho-unlike").on("click",function(){
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
          });
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
  function addComment(username,context,likenumb,objectid,likestaus) {
    var svgicon = $("<svg width='50' height='50'><rect x='0' y='0' rx='10' ry='10' width='50' height='50' style='fill:blue;stroke:black;stroke-width:1;opacity:0.4'/>你的浏览器还不支持SVG</svg>");
    var likeicon = $("<div class='Aho-like'></div>");
    var likedicon = $("<div class='Aho-like Aho-liked'></div>");
    //var likedicon = $("<img class='Aho-votebtn' src='https://png.icons8.com/ios/50/666666/sort-up-filled.png'></img>");
    var unlikeicon = $("<div class='Aho-unlike'></div>");
    var unlikedicon = $("<div class='Aho-unlike Aho-unliked'></div>");

    //var unlikedicon = $("<img class='Aho-votebtn' src='https://png.icons8.com/ios/50/666666/sort-down-filled.png'></img>");
    var likenumber = $("<p class='Aho-likenumber'></p>");
    var comment = $("<div class='Aho-comment'><div class='Aho-profileimg'></div><div class='Aho-comment-context'><p class='Aho-username-p'></p><p class='Aho-comment-p'></p></div><div class='Aho-comment-vote'></div></div>")
    comment.attr("id",objectid);
    comment.children(".Aho-comment-context").children(".Aho-username-p").text(username);
    comment.children(".Aho-comment-context").children(".Aho-comment-p").text(context);
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
  }
  chrome.runtime.sendMessage({"code":"100"},function (response){});
  chrome.runtime.onMessage.addListener(function(msg,sender,sq){
    console.log(msg["website"]);
    $("#Aho-btn-send").attr("data",msg["website"]);
    //addComment("Ahoukuseeeee",msg["website"],"99");
    reflashCommentBox($("#Aho-commentbox"),msg["website"]);
  });
  //db.comment.insertOne({"user":{"username":"Rrt0"},"status":"000","context":"呀!","website":"https://ahhhh.com.cn/article/gv317992/","likenumber":"-1"})
  //db.comment.updateMany({"website":"https://ahhhh.com.cn/article/gv317992/"},{$set:{"website":"https://ahhhh.com.cn/article/gv317992"}})
  textarea.prependTo(sendbox);

  sidebtn.prependTo(body);
  icon.prependTo(sidebtn);
  sidebtn.on("click",function () {
    if (sidebtn.attr("data") == "open") {
      sideview.animate({left:"-400px"});
      sidebtn.animate({left:"0px"});
      sidebtn.children("img").css("transform","rotate(0deg)");
      sidebtn.attr("data","close");
    }
    else{
      sideview.animate({left:"0px"});
      sidebtn.animate({left:"399px"});
      sidebtn.children("img").css("transform","rotate(180deg)");
      sidebtn.attr("data","open");
    }
  });
  $("#Aho-commentbox").on("scroll",function () {
    var currentpage = $(this).attr("data");

    if ($(this).scrollTop() > currentpage*300 && $(this).scrollTop()%10==0) {
      var page = Math.ceil($(this).scrollTop()/300);
      chrome.storage.sync.get(["id"],function (result) {
        reflashCommentBox($("#Aho-commentbox"),$("#Aho-btn-send").attr("data"),result["id"],page,add=true);
        $(this).attr("data",page);
      });
    }
  });
})
