
/*
	Game: Candy Crush clone (simple)
	Author: Gerardo Avelra <gerardo.avelarp@gmail.com> <http://github.com/gerardoavelar>
	Date: 24 May 2018
	The base of this code is a copy from a source code by Didier Chartrain <copycut.design@gmail.com>
*/


var newGame;



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

var Game = function() {

	this.init = function(size, base, ui) {
		this.base = base;
		this.ui = ui;
		this.originalSize = size;
		this.size = this.originalSize * this.originalSize;
		this.caseHeight = base.height() / this.originalSize;
		this.caseWidth = base.width() / this.originalSize;
		this.level = [];
		this.typesOfcandies = 3;
		this.fillEnd = true;
		this.switchEnd = true;
		this.playerCanControl = false;
		this.populateLevel();
		this.drawNewLevel();
		this.score = 0;
		this.move = 0;

		setTimeout($.proxy(this.checkLines, this), 1000);
	};

	this.releaseGameControl = function(play) {
		if (play) {
			this.playerCanControl = true;
			//this.bindDraggableEvent();
		} else {
			this.playerCanControl = false;
			//base.find('.row').hammer().off('swipeleft swiperight swipeup swipedown');
		}
	};

	this.bindDraggableEvent = function() {
		var that = this;
		var position;

		this.base.hammer().on('dragleft dragright dragup dragdown', '.row', function(event) {

			//console.log('swipe', this, event);

			event.gesture.preventDefault();

			position = +$(this).attr('data-id');

			if (position !== undefined) {
				that.testMove(position, event.type);
				event.gesture.stopDetect();
				return;
			}
		});
	};

	this.testMove = function(position, direction) {
		switch(direction) {
			case "dragleft":
				if (position % this.originalSize !== 0) {
					this.swipecandies(this.base.find('.row[data-id='+position+']'), position, this.base.find('.row[data-id='+(position - 1)+']'), position - 1);
			}
			break;

			case "dragright":
				if (position % this.originalSize !== this.originalSize - 1) {
					this.swipecandies(this.base.find('.row[data-id='+position+']'), position, this.base.find('.row[data-id='+(position + 1)+']'), position + 1);
				}
			break;

			case "dragup":
				this.swipecandies(this.base.find('.row[data-id='+position+']'), position, this.base.find('.row[data-id='+(position - this.originalSize)+']'), position - this.originalSize);
			break;

			case "dragdown":
				this.swipecandies(this.base.find('.row[data-id='+position+']'), position, this.base.find('.row[data-id='+(position + this.originalSize)+']'), position + this.originalSize);
			break;
		}
	};

	this.swipecandies = function(a, aID, b, bID) {

		//console.log("switch: ", aID, bID);

		if (this.switchEnd && a !== undefined && b !== undefined && aID >= 0 && bID >= 0 && aID <= this.size && bID <= this.size) {

			var that = this;
			var aTop = a.css('top');
			var aLeft = a.css('left');
			var bTop = b.css('top');
			var bLeft = b.css('left');
			var aType = this.level[aID];
			var bType = this.level[bID];

			this.switchEnd = false;

			this.level[aID] = bType;
			this.level[bID] = aType;

			this.moveUpdate(1);

			//console.log("a&b types: ", bType, aType);

			a.attr('data-id', bID).animate({
				top: bTop,
				left: bLeft
			}, 250);

			b.attr('data-id', aID).animate({
				top: aTop,
				left: aLeft
			}, 250, function() {
				that.switchEnd = true;
				that.checkLines();
			});
		}
	};

	this.populateLevel = function() {
		var i;
		for (i = 0; i < this.size; i++) {
			//not use 0
			this.level[i] = Math.round(Math.random() * this.typesOfcandies+1);
		}
	};

	this.drawNewLevel = function() {
		var i;
		var row = $(document.createElement('img'));
		var lines = -1;

		$('.row').remove();

		for (i = 0; i < this.size; i++) {

			if (i % this.originalSize === 0) {
				lines++;
			}

			row.css({
				top: lines * this.caseHeight,
				left: i % this.originalSize * this.caseWidth,
				height: this.caseHeight,
				width: this.caseWidth
			}).attr({
				"class": 'type-' + this.level[i] + ' row',
				"data-id": i,
				"src": "image/"+this.level[i]+".png"
			});

			this.base.append(row.clone());
		}

		this.lines = lines + 1;
		this.itemByLine = this.size / this.lines;

		this.bindDraggableEvent();
		this.releaseGameControl(true);
	};

	this.checkLines = function() {
		var k;
		var counter = 0;

		//reset
		this.base.find('.row').removeClass('.glow');

		for (k = 0; k < this.size; k++) {
			counter = counter + this.checkcandyAround(this.level[k], k);
		}

		if (counter === this.size) {
			this.releaseGameControl(true);
			return true;
		} else {
			this.releaseGameControl(false);
			return false;
		}
	};

	this.checkcandyAround = function(candyType, position) {
		var flag = false;

		if ( this.level[position - 1] === candyType && this.level[position + 1] === candyType && (position + 1) % this.lines !== 0 && position % this.lines ){
			this.removeClearedcandyToLevel([position, position - 1, position + 1]);
		} else {
			flag = true;
		}

		if ( this.level[position - this.itemByLine] === candyType && this.level[position + this.itemByLine] === candyType ){
			this.removeClearedcandyToLevel([position - this.itemByLine, position, position + this.itemByLine]);
		} else {
			flag = true;
		}

		if (flag) {
			return 1;
		} else {
			return 0;
		}
	};

	this.removeClearedcandyToLevel = function(candiesToRemove) {
		var i;

		for (i = 0; i < candiesToRemove.length; i++) {
			this.level[candiesToRemove[i]] = 0;
			this.animateRemovecandies(candiesToRemove[i]);
		}
	};

	this.animateRemovecandies = function(position) {
		var that = this;

		var difference = this.caseHeight / 2;

		this.base.find('.row[data-id='+position+']')
		.attr('data-id', false)
		.addClass('glow').animate({
			marginTop: difference,
			marginLeft: difference,
			height: 0,
			width: 0
		}, 500, function() {
			$(this).remove();
			that.scoreUpdate(100);
		});

		if (that.fillEnd) {
			that.fillHoles();
		}
	};

	this.movecandies = function(position, line, colPosition, destination) {
		var that = this;

		this.base.find('.row[data-id='+position+']').animate({
			top: Math.abs(line * that.caseHeight)
		}, 100, "swing").attr('data-id', destination);

		this.level[destination] = this.level[position];
		this.level[position] = 0;

		if (line === 1) {
			this.createNewRandomcandy(colPosition);
		}
	};

	this.createNewRandomcandy = function(colPosition) {
		// console.log("createNewRandomcandy", colPosition);

		var that = this;
		var candy = $(document.createElement('img'));

		this.level[colPosition] = Math.round(Math.random() * this.typesOfcandies+1);

		candy.addClass('type-' + this.level[colPosition] +' row').css({
			top: -this.caseHeight,
			left: colPosition * this.caseWidth,
			height: this.caseHeight,
			width: this.caseWidth,
			opacity: 0
		}).attr({
			"data-id": colPosition,
			"src": "image/"+this.level[colPosition]+".png"
		});

		candy.appendTo(this.base);

		candy.animate({
			top: 0,
			opacity: 1
		},200);

		this.bindDraggableEvent();
	};

	this.fillHoles = function(){
		// console.log("fillHoles");

		var i;
		var counter = 0;

		this.releaseGameControl(false);

		this.fillEnd = false;

		for (i = 0; i < this.level.length; i++) {

			var under = i + this.originalSize;
			var lignePosition = Math.floor(under / this.originalSize);
			var colPosition = under - Math.floor(lignePosition * this.originalSize);

			if (this.level[under] === 0 && this.level[i] !== 0) {

				if (this.level[under] === 0 && this.level[under] !== undefined) {
					this.movecandies(i, lignePosition, colPosition, under);
				}

				break;

			} else if (this.level[i] === 0) {
				this.createNewRandomcandy(colPosition);
			} else if (this.level[i] !== 0) {
				counter++;
			}
		}

		//console.log(this.level.length, counter);

		if (this.level.length === counter) {
			//console.log('no hole left');
			this.fillEnd = true;
			return setTimeout($.proxy(this.checkLines, this), 50);
		} else {
			return setTimeout($.proxy(this.fillHoles, this), 50);
		}
	};


	this.scoreUpdate = function(score){
		this.score = Math.floor(this.score + score / 3, 10);
		this.ui.find('#score-text').text(this.score);
	};

	this.moveUpdate = function(move){

		if (move >= 0) {
			this.move = this.move + move;
			this.ui.find('#movimientos-text').text(this.move);
		} else {
			this.move = 0;
		}
	};
};


$(document).ready(function() {
	var $game = $('#panel-tablero');
	var $ui = $('#panel-score');

	function loop(){
		$('.main-titulo').css({
			'color': "#DCFF0E"
		});
		$('.main-titulo').animate({
			color: "#FFFFFF"
		}, Math.random()*2000, function(){
			loop();
		});
	};
	$(document).on('load',loop());

	$('#btn-inicio').on('click', function(event) {
		event.preventDefault();
		var value = 7;
		newGame = new Game();
		newGame.init(value, $game, $ui);
		$(this).replaceWith('<button class="btn-reinicio" id="btn-reinicio" onclick="restart()">Reiniciar</button>');
		jQuery(function ($) {
	      var twoMinutes = 60 * 2,
	          display = $('#timer');
	      startTimer(twoMinutes, display);
	  });
		setInterval(function(){
			$('.panel-tablero').attr('class','tablero-over')
			$('.panel-score').attr('class','titulo-over')
			$('.time').attr('class','time-over')
		}, 1000*60*2)
	});

});
