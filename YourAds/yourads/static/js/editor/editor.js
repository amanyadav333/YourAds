(function () {
  new FroalaEditor("#edit");
})();

function show(){
  var tab=document.getElementById('myCanvas');
  var rows = tab.rows;
    for (var i = 0; i < rows.length; i++) {
        var rowText = rows[i].firstChild;
        var col=rowText.style.backgroundColor;
        rowText.style.border='1px solid '+col;
    }
       kendo.drawing
       .drawDOM("#myCanvas").then(function(group){
          var a=kendo.drawing.pdf.saveAs(group, "Ex.pdf");
          
      });
  }

 function edit() {
     var id=document.getElementById('edit');
     var c=id.children;
     var x=c[3].children.length;
     c[3].removeChild(c[3].childNodes[0]);
     var y=c[2].children;
     y[0].style.width='250px';
     y[0].style.marginLeft='230px';
     y[0].id='#myCanvas';
 }