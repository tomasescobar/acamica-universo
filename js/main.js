var HomeAnimation = function() {
	t = this,

	// Elements
	t.frame = $('#frame'),
	t.sky = $('#sky'),
	t.land = $('#land'),
	t.rocket = $('#rocket'),
	t.titles = $('#titles'),

	t.init = function() {
		var winW = $(window).width();
		var winH = $(window).height();
		var rocketTopLimit = winH*.2;

		// Frame
		t.rocket.css({
			left: '50%'
		})

		t.titles.css({
			marginTop: 0,
			top: rocketTopLimit+'px'
		})

		// Resize update
		$(window).resize(function() {
			winW = $(window).width();
			winH = $(window).height();
			rocketTopLimit = winH*.15;
			$(document).trigger('scroll');
		});

		// Titles scroll event
		$(document).on('scroll', function(e) {
			var scrol = $(this).scrollTop();

			if (scrol < 0) return;
						
			// Land hide
			t.land.css('top',scrol+'px');
			t.sky.css('bottom',-scrol+'px');
			t.titles.css('top',(rocketTopLimit+(scrol*1.5))+'px');

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