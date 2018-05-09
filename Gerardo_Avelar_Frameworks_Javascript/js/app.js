
$(document).ready(function(){

  //Title color change
  function loop(){
    $('.main-titulo').css('color','#DCFF0E');
    $('.main-titulo').animate({
      color: "#FFFFFF"
    }, Math.random()*1000, function(){
      loop();
    });
  };
  loop()

  var rows = 7;
  var cols = 7;
  var grid = [];

  function candy(r,c,obj,src){
    return {
      r: r,  // Current row of the object
      c: c,  // Current column of the object
      src:src, // The image showed in cell
      locked:false, // Property indicates if the cell is locked
      isInCombo:false, // Property indicates if the cell (r,c) is currently in valid figure
      o:obj // Pointer to a jQuery object
    };
  };

  // Candy images
  var candies = [];
  candies[0] = "image/1.png";
  candies[1] = "image/2.png";
  candies[2] = "image/3.png";
  candies[3] = "image/4.png";

  // Return a random image
  function randomCandy(){
    var pickInt = Math.floor((Math.random()*4));
    return candies[pickInt];
  };

  // prepare grid - Simple and fun!
  for (var r = 0; r < rows; r++){
    grid[r] = [];
    for (var c = 0; c < cols; c++){
      grid[r][c] = new candy(r,c,null,randomCandy());
    };
  };

  // executed when user clicks on an image
  function dragStarts(a){
    a.dataTransfer.setData("text/plain", a.target.id);
  };

  // executed when user moves image over another without releasing it
  function enableDragOver(e){
    e.preventDefault();
    console.log("drag over" + e.target.id);
  };

  // executes when user releases image on other image
  function dropImage(e){
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        console.log("firefox compatibility");
        e.preventDefault();
    }

    // gets source candy
     var from = e.dataTransfer.getData("text");
     var fromr = from.split("_")[1];
     var fromc = from.split("_")[2];

     // get destination jewel
     var to = e.target.id;
     var tor = to.split("_")[1];
     var toc = to.split("_")[2];

     // check distance between jewel and avoid jump with distance > 1 ;)
     var ddx = Math.abs(parseInt(fromr)-parseInt(tor));
     var ddy = Math.abs(parseInt(fromc)-parseInt(toc));
     if (ddx > 1 || ddy > 1){
       console.log("invalid! distance > 1");
       return;
     };

    // executes image swap
    var tmp = grid[fromr][fromc].src;
    grid[fromr][fromc].src = grid[tor][toc].src;
    grid[fromr][fromc].o.attr("src",grid[fromr][fromc].src);
    grid[tor][toc].src = tmp;
    grid[tor][toc].o.attr("src",grid[tor][toc].src);

    // searches for valid figures
    _checkAndDestroy();
  };

  $("#btn-inicio").click(function(){
    //Create elements in cells
    for(var r = 0; r < rows; r++){
      for (var c =0; c< cols; c++){
        var cell = $("<img id='"+r+"_"+c+"' r='"+r+"' c='"+c+"' ondrop='dropImage(event)' ondragover='enableDragOver(event)' src='"+grid[r][c].src+"' style='width:"+99.4+"px;height:"+96+"px;margin-top:"+0+"px;margin-left:"+10.225+"px;margin-right:"+10.225+"px'/>");
        cell.attr("ondragstart","dragStarts(event)");
        $(".panel-tablero").append(cell);
        grid[r][c].o = cell;
      };
    };
    //Change button to restart
    $(this).replaceWith('<button class="btn-reinicio" id="btn-reinicio">Reniciar</button>')
});


/*
  $("#btn-inicio").click(function(){

    //Select all div columns
    var cols = $('[class^="col-"]');

    //Go through container and add random images per columns
    for(var i = 0; i < cols.length; i++){
      if($('.col-1').children().length <= 6){
        var item = imgs[Math.floor(Math.random()*imgs.length)];
        $('.col-1').append(item);
      };
      if($('.col-2').children().length <= 6){
        var item = imgs[Math.floor(Math.random()*imgs.length)];
        $('.col-2').append(item);
      };
      if($('.col-3').children().length <= 6){
        var item = imgs[Math.floor(Math.random()*imgs.length)];
        $('.col-3').append(item);
      };
      if($('.col-4').children().length <= 6){
        var item = imgs[Math.floor(Math.random()*imgs.length)];
        $('.col-4').append(item);
      };
      if($('.col-5').children().length <= 6){
        var item = imgs[Math.floor(Math.random()*imgs.length)];
        $('.col-5').append(item);
      };
      if($('.col-6').children().length <= 6){
        var item = imgs[Math.floor(Math.random()*imgs.length)];
        $('.col-6').append(item);
      };
      if($('.col-7').children().length <= 6){
        var item = imgs[Math.floor(Math.random()*imgs.length)];
        $('.col-7').append(item);
      };
    };
    $('[id^="img"]').draggable({
      grid: [119.85,96]
    });
  });

  //Verify consecutive images
  function checkCandies(){
    var cols = $('[class^="col-"]');
    var col1 = $('.col-1').children();
    //Check vertical
    for(var i = 0; i < cols.length; i++){
      if(col1[i].getAttribute('id') == $.parseHTML(img1)[0].getAttribute('id')){
        group += col1[i];
      }
    }
  }


*/

});
