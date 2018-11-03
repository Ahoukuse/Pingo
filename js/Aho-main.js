$(function() {
  $( ".input-text input" ).on( "focus",function() {
    var elem = $( this ).prev();
    elem.removeClass("label-halt");
    elem.addClass("label-active");
  });
  $( ".input-text input" ).on( "focusout",function() {
    var elem = $( this ).prev();
    if ($( this ).val() == "") {
      elem.removeClass("label-active");
      elem.addClass("label-halt");
    }
  });
  $( ".input-text label" ).on("click",function(){
    var input_text = $(this).next();
    input_text.focus();
  });
  $( ".bottom-float" ).hover(function() {
    let elem = $(".float-out");
    elem.removeClass("hover-float");
    elem.addClass("hover-float-out");
    elem.css("float","right");
  });
  $( ".bottom-float" ).mouseleave(function() {
    let elem = $(".float-out");
    elem.removeClass("hover-float-out");
    elem.addClass("hover-float");

    elem.css("float","left");
  });
  $( ".switches" ).on("click",function() {
    if ($(this).hasClass("switchesoff")) {
      $(this).removeClass("switchesoff");
      $(this).addClass("switcheson");
    }
    else if($(this).hasClass("switcheson")){
      $(this).removeClass("switcheson");
      $(this).addClass("switchesoff");
    }
  });
  $( ".select .select-hand" ).on("click",function(event) {
    event.stopImmediatePropagation();
    let icon =  $(this).children(".icon");
    let parent = $(this).parent();
    console.log(parent);
    if (parent.hasClass("close")) {
      parent.removeClass("close");
      icon.removeClass("turndown");
      icon.addClass("turnup");
      console.log("416541651");
    }
    else{
      console.log("efih");
      parent.addClass("close");
      icon.removeClass("turnup");
      icon.addClass("turndown");
    }

  });
  $( "body" ).click(function () {
    $( ".select" ).each(function(index,element){
      $(this).addClass("close");
      let icon = $(this).children(".select-hand").children(".icon");
      icon.removeClass("turnup");
      icon.addClass("turndown");
    });
  });
  $( ".select .cover ul li" ).on("click",function() {
    let tag = $(this).parent().parent().prev().children("span");
    tag.text($(this).text());
  });
})
