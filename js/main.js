var HomeAnimation = function() {
	t = this,
	t.rocketIsAnimating = false,
	t.sceneTransition = false,
	t.scene = 1,
	t.wvalues = {},
	t.inputFocus = false,

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
	t.planets = $('#planets').children('span'),
	t.planets_count = t.planets.length,

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

		// Load hash on load
		if (window.location.hash) {
			t.hashEvent();
		}

		// Scroll #hash or arrows (go to scene)
		$(window).on('hashchange', function(e) {
			e.preventDefault();
			return t.hashEvent();
		})

		// Scroll arrows click / push hash state
		t.titles.find('.arrow-scroll-button').click(function(e) {
			e.preventDefault();
			var url = this.href.substring(this.href.indexOf('#'));
			if (history.pushState) { 
				history.pushState({}, "", url);
	        } else {
				window.location.hash = url;
			}
			window.location.hash == url ? t.hashEvent() : null;
			// return false;
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
			// t.planets.css('bottom',-scrol+'px');

			// Land hide
			t.land.css('top',scrol+'px');
			// Rocket launch
			if (scrol > 20 && scrol < t.wvalues.rocketTopLimit) {
				t.rocket.removeClass().css('bottom', scrol+'px');
			} else if (scrol <= 20) {
				t.rocket.addClass('landed').css('bottom', '0px')
			}

			// Clouds
			if (scrol+t.wvalues.winH < 3500) {
				for (var i = 0; i < t.cloud_count; i++) {
					var cloud = t.clouds.eq(i);
					cloud.css('top',(scrol*cloud.attr('data-speed'))+'px');
				}
			}

			// Planets
			if (scrol+t.wvalues.winH > 3500) {
				for (var i = 0; i < t.planets_count; i++) {
					var planet = t.planets.eq(i);
					planet.css('top',(scrol*planet.attr('data-speed'))+'px');
				}
			}

		});

		// Form mail
		$('#notify-mail').on('submit', function() {
			t.submitForm(this, t.notifyFormResponse);
			return false;
		});

		// Input focus
		$('input').focus(function() {
			t.inputFocus = true;
		}).blur(function() {
			t.inputFocus = false;
		})

		// Keyboard scroll
		$(document).on('keydown', function(e) {
			if (t.inputFocus) return;
			var key = e.keyCode;
			switch(key) {
				// Down
				case 40:
				case 32:
					e.preventDefault();
					t.gotoNextScene();
					break;
				// Up
				case 38:
					e.preventDefault();
					t.gotoPrevScene();
					break;
			}
		});
	}

	// Hash event
	t.hashEvent = function() {
		var element = $(window.location.hash);
		if (element.length > 0) {
			t.scrollToElement(element);
			return false;
		}
		return false;
	}

	// Next scene
	t.gotoNextScene = function() {
		if (!t.sceneTransition && t.scene < t.scenes_count) {
			t.scrollToElement(t.scenes.eq(t.scenes_count-(t.scene+1)));
		}
	}

	// Previous scene
	t.gotoPrevScene = function() {
		if (!t.sceneTransition && t.scene > 1) {
			t.scrollToElement(t.scenes.eq(t.scenes_count-(t.scene-1)));
		}
	}

	// Scroll to element
	t.scrollToElement = function(element) {
		var index = t.scenes.index(element);
		// Set scene
		t.scene = t.scenes_count-index;

		var finalscroll = 0;
		for (var i = t.scenes_count-1; i>index; i--) {
			finalscroll += Math.abs(t.scenes.eq(i).offset().top-t.scenes.eq(i-1).offset().top);
		}
		if (index==0) {
			finalscroll = $(document).outerHeight()-$(window).height();
		}
		t.sceneTransition = true;
		$('body').stop(true).animate({
			scrollTop: finalscroll
		}, 1000, function() {
			t.sceneTransition = false;
			// Focus mail on end
			if (t.scene == 5) {
				$('input[name="email"]').focus();
			}
		});
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
				case 'alreadyexists':
					msg = 'Ya estás inscrito con esta dirección de email';
					break;
				default:
					msg = 'Ha ocurrido un error. Por favor intenta nuevamente.'
					break;
			}
			form.find('.error-display').show().children().html(msg)
		}
	}

	t.init();
}

var landing = 1;
$(document).ready(function() {
	window.a = new HomeAnimation();
});