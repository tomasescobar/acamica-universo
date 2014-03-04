// Setear eventos a medir
$(document).ready(function() {
	$('#notify-mail').one('submit', function() {
		console.log('Submit mail')
	})
	$('#login-button').one('click', function() {
		console.log('Click login button')
	})
	
	var midscroll = false;
	$(document).on('scroll.fullevent', function() {
		var height = $(this).outerHeight()-$(window).outerHeight();
		if ($(this).scrollTop() >= height) {
			console.log('Full scroll event')
			$(this).off('scroll.fullevent');
		} else if (!midscroll && $(this).scrollTop() >= height/2) {
			console.log('Mid scroll event')
			midscroll = true;
		}
	})

	// Conversion
	$(document).one('conversion', function() {
		$('#tracking').append('<iframe src="conversion_tracking'+(window.landing==1?'_2':'')+'.html" frameborder="0" scrolling="no" width="1" height="1" style="visibility:hidden;display:none"></iframe>');
	})
});