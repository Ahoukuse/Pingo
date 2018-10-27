$(function() {
  var website = '';

  var body = $("body");
  var sideview = $("<div></div>");
  var sidebtn = $("<div></div>");
  var sendbox = $("<div></div>");
  var commentbox = $("<div></div>");
  var sendbtn = $("<button id='Aho-btn-send'type='button' name='Aho-btn-send'>咻咻！</button>");
  var textarea = $("<div id='Aho-textarea'><p>Hi</p></div>");
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
  function addComment(username,context,likenumb) {
    var svgicon = $("<svg width='50' height='50'><rect x='0' y='0' rx='10' ry='10' width='50' height='50' style='fill:blue;stroke:black;stroke-width:1;opacity:0.4'/>你的浏览器还不支持SVG</svg>");
    var likeicon = $("<img class='Aho-votebtn' src='https://png.icons8.com/ios/50/666666/sort-up.png'></img>");
    var likedicon = $("<img class='Aho-votebtn' src='https://png.icons8.com/ios/50/666666/sort-up-filled.png'></img>");
    var unlikeicon = $("<img class='Aho-votebtn' src='https://png.icons8.com/ios/50/666666/sort-down.png'></img>");
    var unlikedicon = $("<img class='Aho-votebtn' src='https://png.icons8.com/ios/50/666666/sort-down-filled.png'></img>");
    var likenumber = $("<p class='Aho-likenumber'></p>");
    var comment = $("<div class='Aho-comment'><div class='Aho-profileimg'></div><div class='Aho-comment-context'><p class='Aho-username-p'></p><p class='Aho-comment-p'></p></div><div class='Aho-comment-vote'></div></div>")
    comment.children(".Aho-comment-context").children(".Aho-username-p").text(username);
    comment.children(".Aho-comment-context").children(".Aho-comment-p").text(context);
    likenumber.text(likenumb);
    svgicon.prependTo(comment.children(".Aho-profileimg"));
    unlikeicon.prependTo(comment.children(".Aho-comment-vote"));
    likenumber.prependTo(comment.children(".Aho-comment-vote"));
    likeicon.prependTo(comment.children(".Aho-comment-vote"));
    comment.appendTo(commentbox);
  }
  chrome.runtime.sendMessage({"code":"100"},function (response){});
  chrome.runtime.onMessage.addListener(function(msg,sender,sq){
    console.log(msg["website"]);
    addComment("Ahoukuseeeee",msg["website"],"99");
  });
  addComment("Ahoukuse","Hello","99");
  addComment("Ahoukuse","Hello","99");
  addComment("Ahoukused","Hello","99");
  addComment("Ahoukused","Hello","99");
  addComment("Ahoukused","Hello","99");
  addComment("Ahoukused","Hello","99");
  addComment("Ahoukused","Hello","99");
  addComment("Ahoukused","Hello","99");

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
})
