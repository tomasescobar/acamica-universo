var HomeAnimation = function() {
	t = this,

	// Elements
	t.frame = $('#frame'),
	t.sky = $('#sky'),
	t.land = $('#land'),
	t.rocket = $('#rocket'),
	t.titles = $('#titles'),

	t.init = function() {
		var winW = $(window).width(),
		winH = $(window).height(),
		rocketTopLimit = winH*.25,
		titlesBottomLimit = winH*.5,
		scenarioH = t.titles.outerHeight()-t.titles.find('.scene').eq(0).height();

		// Frame default positions
		t.rocket.css({
			left: '50%'
		})
		t.titles.css({
			bottom: titlesBottomLimit+'px'
		})

		// Total height
		$('body').height(scenarioH);
		t.sky.height(scenarioH);

		// Resize update
		$(window).resize(function() {
			winW = $(window).width();
			winH = $(window).height();
			rocketTopLimit = winH*.25;
			titlesBottomLimit = winH*.5;
			$(document).trigger('scroll');
		});

		// Titles scroll event
		$(document).on('scroll', function(e) {
			var scrol = $(this).scrollTop();

			if (scrol < 0 || scrol > 6000) {
				t.land.css('top','0px');
				t.sky.css('bottom','0px');
				t.titles.css('bottom',titlesBottomLimit+'px');
				return false;
			}
			console.log(scrol)
			// Land hide
			t.land.css('top',scrol+'px');
			t.sky.css('bottom',-scrol+'px');
			t.titles.css('bottom',titlesBottomLimit-(scrol*1.4)+'px');

			// Rocket launch
			if (scrol > 30 && scrol < rocketTopLimit) {
				t.rocket.addClass('on').css('bottom', scrol+'px');
			} else if (scrol >= 0 && scrol < rocketTopLimit) {
				t.rocket.removeClass('on').css('bottom', scrol+'px')
			} else {
				t.rocket.css('bottom', rocketTopLimit+'px');
			}

			t.titlesFade(scrol);
		})
	}

	// Fade titles as we go up
	t.titlesFade = function(scrol) {

	}

	t.init();
}

$(document).ready(function() {
	window.a = new HomeAnimation();
});