var HomeAnimation = function() {
	t = this,
	t.rocketIsAnimating = false,
	t.scene = 1,
	t.wvalues = {},

	// Elements
	t.frame = $('#frame'),
	t.sky = $('#sky'),
	t.land = $('#land'),
	t.rocket = $('#rocket'),
	t.titles = $('#titles'),
	t.scenes = $('#titles .scene'),
	t.scenes_count = t.scenes.length,
	t.clouds = $('#clouds').children('span'),
	t.cloud_count = t.clouds.length,
	t.endplanet = $('#end-planet'),
	t.planets = $('#planets'),

	t.init = function() {

		t.wvalues = t.updateWindowValues();

		// Resize update
		$(window).resize(function() {
			t.wvalues = t.updateWindowValues();
			$(document).trigger('scroll');
		}).on('load', function() {
			setTimeout(function() {
				window.scrollTo(0,0);
			},0);
		})

		// Scroll #hash or arrows (go to scene)
		$(window).on('hashchange', function(e) {
			e.preventDefault();

			return t.hashEvent();
		})

		// Scroll arrows click
		t.titles.find('.arrow-scroll-button').click(function() {
			window.location.hash == this.href ? t.hashEvent() : null;
		});

		var landed_up = false;

		// Titles scroll event
		$(document).on('scroll', function(e) {
			var scrol = $(this).scrollTop(), height = $(this).outerHeight();

			var sw = scrol+t.wvalues.winH, docH = $(this).outerHeight()-30;
			if (scrol <= 0) {
				landed_up = false;
				t.land.css('top','0px');
				t.sky.css('bottom','0px');
				t.planets.css('bottom','0px');
				t.titles.css('bottom',-t.wvalues.titlesInitialBottom+'px');
				t.rocket.addClass('landed').css('bottom', '0px');
				return false;
			} else if (!landed_up && scrol >= height-t.wvalues.winH) {
				landed_up = true;
				t.rocket.removeClass().addClass('land-up');
				t.rocket.animate({
					bottom: (t.wvalues.winH-t.endplanet.outerHeight()-50),
				}, 1000, function() {
					t.rocket.removeClass().addClass('land-up-stand')
				})
				return false;
			} else if (landed_up && sw < docH) {
				t.rocket.stop(true).removeClass();
				t.rocket.css('bottom',t.wvalues.rocketTopLimit+'px')
				landed_up = false;
			}

			// Global elements (present in all scenes)
			t.sky.css('bottom',-scrol+'px');
			t.titles.css('bottom',(-scrol-t.wvalues.titlesInitialBottom)+'px');

			// Land hide
			t.land.css('top',scrol+'px');
			// Rocket launch
			if (scrol > 20 && scrol < t.wvalues.rocketTopLimit) {
				t.rocket.removeClass().css('bottom', scrol+'px');
			} else if (scrol <= 20) {
				t.rocket.addClass('landed').css('bottom', '0px')
			}

			// Clouds
			if (t.scene < 3) {
				for (var i = 0; i < t.cloud_count; i++) {
					var cloud = t.clouds.eq(i);
					cloud.css('top',(scrol*cloud.attr('data-speed'))+'px');
				}
			}

			// Titles
			// t.titlesFade(scrol);
		}).on('scrollstop', function() {
			console.log('end')
		})

		// Form mail
		$('#notify-mail').on('submit', function() {
			t.submitForm(this, t.notifyFormResponse);
			return false;
		});
	}

	t.hashEvent = function() {
		var element = $(window.location.hash);
		if (element.length) {
			console.log($('body').scrollTop()+' - '+Math.abs(element.offset().top-t.wvalues.titlesTopLimit));
			$('body').stop(true).animate({
				scrollTop: '+='+(Math.abs(element.offset().top)+t.wvalues.titlesTopLimit)+'px'
			}, 1000);
			return false;
		}
		return false;
	}

	t.updateWindowValues = function() {
		var vars = {
			winW: $(window).width(),
			winH: $(window).height(),
			rocketTopLimit: $(window).height()*.1,
			titlesTopLimit: $(window).height()*.2,
			titlesInitialBottom: $(window).height()*.2+(t.scenes.last().outerHeight()),
			pageH: $(document).outerHeight()
		}

		// Frame default positions
		t.rocket.css({
			left: '50%'
		})
		t.titles.css({
			paddingTop: vars.titlesTopLimit+'px',
			paddingBottom: vars.winH+'px',
			bottom: -vars.titlesInitialBottom+'px'
		})

		var scenarioH = t.titles.outerHeight()-vars.titlesInitialBottom;

		// Total height scenario
		$('body').height(scenarioH);
		t.sky.height(scenarioH);

		return vars;
	}

	// Fade titles as we go up
	t.titlesFade = function(scrol) {
		console.log('Offset top: '+t.scenes.last().offset().top+' - Scrolltop: '+scrol+' - Toplimit:'+t.wvalues.titlesTopLimit)
		for (var i = t.scenes_count-1; i >= 0; i--) {
			var element = t.scenes.eq(i), eof = element.offset().top;
			if (eof+scrol > t.wvalues.winH) {
				// element.addClass('hidden');
				console.log(i);
			}
		}
	}

	// Submit form
	t.submitForm = function(f,callback) {
    	f = $(f);
    	f.on('submit.form',function() {
	    	return false;
    	});
    	f.find('.error-display').hide()

    	var bot = $('input[type="submit"]',f);
    	bot.attr('disabled','disabled');

    	$.ajax({
    		type:'POST',
    		url: f.attr('action'),
    		data:f.serialize(),
    		dataType:'json',
    		success:function(h) {
    			if (typeof callback == 'function') {
    				callback(f,h)
    			}
    		},
    		error: function (XMLHttpRequest, textStatus, errorThrown) {
                callback(f, {error:true});
            },
            complete: function () {
    			bot.removeAttr('disabled');
    			f.off('submit.form');
            }
    	})
    }

    t.notifyFormResponse = function(form, response) {
    	var form = $(form);
		if (!response.error) {
			form.find('.form-group').eq(0).removeClass('error').addClass('has-success');
			$(document).trigger('conversion');
		} else {
			form.find('.form-group').eq(0).addClass('has-error');
			var msg = '';
			switch (response.errormsg) {
				case 'invalidemail':
					msg = 'La dirección de email no es válida';
					break;
				default:
					msg = 'Ha ocurrido un error. Por favor intenta nuevamente.'
					break;
			}
			form.find('.error-display').html(msg).show()
		}
	}

	t.init();
}

var landing = 1;
$(document).ready(function() {
	window.a = new HomeAnimation();
});