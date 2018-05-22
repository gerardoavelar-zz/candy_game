var rows = 7;
var cols = 7;
var grid = [];
var movCount = 0;
var score = 0;

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

// Prepare grid
for (var r = 0; r < rows; r++){
  grid[r] = [];
  for (var c = 0; c < cols; c++){
    grid[r][c] = new candy(r,c,null,randomCandy());
  };
};

var width = $('.panel-tablero').width();
var height = $('.panel-tablero').height();
var cellWidth = (width / cols);
var cellHeight = (height / rows);
var marginWidth = cellWidth/cols;
var marginHeight = cellHeight/rows;

$("#btn-inicio").click(function(){
  //Create elements in cells
  for(var r = 0; r < rows; r++){
    for (var c = 0; c < cols; c++){
      var cell = $("<img id='"+r+"_"+c+"' r='"+r+"' c='"+c+"' ondrop='dropImage(event)' ondragover='enableDragOver(event)' src='"+grid[r][c].src+"' style='width:"+
                 cellWidth+"px;height:"+cellHeight+"px;top:"+
                 r*cellHeight+"px;left:"+(c*cellWidth+marginWidth)+"px'/>");
      cell.attr("ondragstart","dragStarts(event)");
      $(".panel-tablero").append(cell);
      grid[r][c].o = cell;
    };
  };
  //Change button to restart
  $(this).replaceWith('<button class="btn-reinicio" id="btn-reinicio" onclick="restart()">Reiniciar</button>');
  jQuery(function ($) {
      var twoMinutes = 60 * 2,
          display = $('#timer');
      startTimer(twoMinutes, display);
  });
  _executeDestroyMemory();

  setInterval(function(){
    $('.panel-tablero').attr('class','tablero-over')
    $('.panel-score').attr('class','titulo-over')
    $('.time').attr('class','time-over')
  }, 1000*60*2)
});

function restart(){
  location.reload()
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            timer = duration;
        }
    },1000);
}


// Executed when user clicks on an image
function dragStarts(a){
  a.dataTransfer.setData("text/plain", a.target.id);
  console.log("drag from " + a.target.id);
};

// executed when user moves image over another without releasing it
function enableDragOver(e) {
  e.preventDefault();
  console.log("drag over " + e.target.id);
};

// executes when user releases image on other image
function dropImage(e) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (isFirefox) {
      console.log("firefox compatibility");
      e.preventDefault();
  }

  // gets source candy
   var from = e.dataTransfer.getData("text");
   var fromr = from.split("_")[0];
   var fromc = from.split("_")[1];

   // get destination candy
   var to = e.target.id;
   var tor = to.split("_")[0];
   var toc = to.split("_")[1];

   // check distance between jewel and avoid jump with distance > 1 ;)
   var ddx = Math.abs(parseInt(fromr)-parseInt(tor));
   var ddy = Math.abs(parseInt(fromc)-parseInt(toc));
   if (ddx > 1 || ddy > 1) {
     console.log("invalid! distance > 1");
     return;
   };

  // executes image swap
  var tmp = grid[fromr][fromc].src;
  grid[fromr][fromc].src = grid[tor][toc].src;
  grid[fromr][fromc].o.attr("src",grid[fromr][fromc].src);
  grid[tor][toc].src = tmp;
  grid[tor][toc].o.attr("src",grid[tor][toc].src);

  $('#movimientos-text').text(movCount+=1)

  // searches for valid figures
  _checkAndDestroy();
};

function _checkAndDestroy() {
  var prevCell = null;
  var figureLen = 0;
  var figureStart = null;
  var figureStop = null;
  var validFigures = 0;
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      // Bypass candies that is in valid figures.
      if (grid[r][c].locked || grid[r][c].isInCombo) {
        figureStart = null;
        figureStop = null;
        prevCell = null;
        figureLen = 1;
        continue;
      }
      // first cell of combo!
      if (prevCell == null) {
        prevCell = grid[r][c].src;
        figureStart = c;
        figureLen = 1;
        figureStop = null;
        continue;
      } else {
        //second or more cell of combo.
        var curCell = grid[r][c].src;
        // if current cell is not equal to prev cell then current cell becomes new first cell!
        if (!(prevCell == curCell)) {
          prevCell = grid[r][c].src;
          figureStart = c;
          figureStop = null;
          figureLen = 1;
          continue;
        } else {
          // if current cell is equal to prevcell then combo length is increased
          // Due to combo, current combo will be destroyed at the end of this procedure.
          // Then, the next cell will become new first cell
          figureLen += 1;
          if (figureLen >= 4) {
            validFigures += 1;
            figureStop = c;
            for (var ci = figureStart; ci <= figureStop; ci++) {
              grid[r][ci].isInCombo = true;
              grid[r][ci].src = null;
              grid[r][ci].o.attr("src","");
            }
            prevCell = null;
            figureStart = null;
            figureStop = null;
            figureLen = 0;
            $('#score-text').text(score+=40)
            _executeDestroyMemory();
            continue;
          }
          if(movCount == 0){
            $('#score-text').text('0');
            continue;
          }
        }
      }
    }
  }
}

function _executeDestroyMemory() {
  // move empty cells to top
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (grid[r][c].isInCombo) { // this is an empty cell
        grid[r][c].o.attr("src","")
        // disable cell from combo
        // (The cell at the end of this routine will be on the top)
        grid[r][c].isInCombo = false;
        for (var sr = r; sr >= 0; sr--) {
          if (sr == 0) {
            break; // cannot shift this is the first row
          }
          if (grid[sr-1][c].locked) {
            break; // cannot shift my top is locked
          };
          // shift cell
          var tmp = grid[sr][c].src;
          grid[sr][c].src = grid[sr-1][c].src;
          grid[sr-1][c].src = tmp;
        }
      }
    }
  }
  console.log("End of movement");
  //redrawing the grid and setup respawn
  //Reset all cells
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      grid[r][c].o.attr("src", grid[r][c].src);
      grid[r][c].o.css("opacity","1");
      grid[r][c].isInCombo = false;
      if (grid[r][c].src == null) {
         grid[r][c].respawn = true;
      }
      // if respawn is needed
      if (grid[r][c].respawn == true) {
        grid[r][c].o.off("ondragover");
        grid[r][c].o.off("ondrop");
        grid[r][c].o.off("ondragstart");
        grid[r][c].respawn = false; // respawned!
        console.log("Respawning " + r+ "," + c);
        grid[r][c].src = randomCandy();
        grid[r][c].locked = false;
        grid[r][c].o.attr("src", grid[r][c].src);
        grid[r][c].o.attr("ondragstart","dragStarts(event)");
        grid[r][c].o.attr("ondrop","dropImage(event)");
        grid[r][c].o.attr("ondragover","enableDragOver(event)");
      }
    }
  }
  console.log("candies resetted and rewpawned");
  // check for other valid figures
  _checkAndDestroy();
}



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
  loop();


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
