$(document).ready(function() {
  var NameCheckbox = $("#NameCheckbox");
  var ColorCheckbox = $("#ColorCheckbox");

});

var onChangeCheckbox = function(){
  if(document.getElementById("NameCheckbox").checked){
    document.getElementById("NameText").disabled = false;
    console.log("COLASDK");
  }
  else{
    document.getElementById("NameText").disabled = true;

  }
}

var onChangeCheckbox2 = function(){
  if(document.getElementById("ColorCheckbox").checked){
    document.getElementById("ColorText").disabled = false;
    console.log("COLASDK");
  }
  else{
    document.getElementById("ColorText").disabled = true;

  }
}
