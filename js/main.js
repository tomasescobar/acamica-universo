var HomeAnimation = function() {
	t = this,
	t.rocketIsAnimating = false,
	t.scene = 1,

	// Elements
	t.frame = $('#frame'),
	t.sky = $('#sky'),
	t.land = $('#land'),
	t.rocket = $('#rocket'),
	t.titles = $('#titles'),
	t.clouds = $('#clouds').children('span'),
	t.cloud_count = t.clouds.length,

	t.init = function() {
		var winW = $(window).width(),
		winH = $(window).height(),
		rocketTopLimit = winH*.15,
		titlesBottomLimit = winH*.4,
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
			rocketTopLimit = winH*.15;
			titlesBottomLimit = winH*.5;
			// t.titles.css('marginBottom',-100+'px')
			$(document).trigger('scroll');
		}).on('load', function() {
			setTimeout(function() {
				window.scrollTo(0,0);
			},0);
		})

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

			// Global elements (present in all scenes)
			t.sky.css('bottom',-scrol+'px');
			t.titles.css('bottom',titlesBottomLimit-(scrol*1.4)+'px');

			// Scene one
			if (t.scene == 1) {
				// Land hide
				t.land.css('top',scrol+'px');
				// Rocket launch
				if (scrol > 30 && scrol < rocketTopLimit) {
					t.rocket.removeClass().css('bottom', scrol+'px');
				} else if (scrol >= 0 && scrol < rocketTopLimit) {
					t.rocket.addClass('landed').css('bottom', scrol+'px')
				} else {
					t.rocket.css('bottom', rocketTopLimit+'px');
				}
			}
			// Rocket animation
			t.rocketAnimation();

			// Clouds
			if (t.scene < 3) {
				for (var i = 0; i < t.cloud_count; i++) {
					var cloud = t.clouds.eq(i);
					cloud.css('top',(scrol*cloud.attr('data-speed'))+'px');
				}
			}

			// Titles
			t.titlesFade(scrol);
		})
	}

	t.rocketAnimation = function() {
		if (t.rocketIsAnimating || t.rocket.hasClass('landed')) return;
		t.rocketIsAnimating = true;
		t.rocket.children().eq(0).fadeOut(2, function() {
			$(this).fadeIn(3, function() {
				t.rocketIsAnimating = false;
				t.rocketAnimation();
			})
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