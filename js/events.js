// Setear eventos a medir
$(document).ready(function() {
	$('#notify-mail').one('submit', function() {
		mixpanel.track("Submit mail", {
			landing: window.landing
		});
	})
	$('#login-button').one('click', function() {
		mixpanel.track("Click login button", {
			landing: window.landing
		});
	})
	$('#contact-button').one('click', function() {
		mixpanel.track("Click contact button", {
			landing: window.landing
		});
	})
	
	var midscroll = false;
	$(document).on('scroll.fullevent', function() {
		var height = $(this).outerHeight()-$(window).outerHeight();
		if ($(this).scrollTop() >= height) {
			// Full scroll
			mixpanel.track("Full scroll", {
				landing: window.landing
			});
			$(this).off('scroll.fullevent');
		} else if (!midscroll && $(this).scrollTop() >= height/2) {
			// Mid scroll
			mixpanel.track("Mid scroll", {
				landing: window.landing
			});
			midscroll = true;
		}
	})

	// Conversion
	$(document).one('conversion', function() {
		$('#tracking').append('<iframe src="conversion_tracking'+(window.landing==2?'_2':'')+'.html" frameborder="0" scrolling="no" width="1" height="1" style="visibility:hidden;display:none"></iframe>');
		mixpanel.track("Conversion", {
			landing: window.landing
		});
	})
});