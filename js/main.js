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
    let elem = $(".float");
    elem.addClass("hover-float");
  });
  $( ".bottom-float" ).mouseleave(function() {
    let elem = $(".float-out");
    elem.addClass("hover-float-out");
  });
})
