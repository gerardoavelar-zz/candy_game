var imgs = ['<img id="img1" class="elemento" src="image/1.png"/>','<img id="img2" class="elemento" src="image/2.png"/>','<img id="img3" class="elemento" src="image/3.png"/>','<img id="img4" class="elemento" src="image/4.png"/>'];

$(document).ready(function(){

  $(".btn-reinicio").click(function(){

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
    $(this).text('Reiniciar')
  });

});
