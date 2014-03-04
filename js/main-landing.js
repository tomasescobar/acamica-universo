var Landing = function() {
	t = this,

	t.init = function() {

		$('#presentation').height($(window).height());

		// Add style header
		$(document).on('scroll', function(e) {
			var scrol = $(this).scrollTop();
			if(scrol > $('#presentation').height()-70){
				$('header').addClass('fixed')
			} else {
				$('header').removeClass('fixed')
			}
		});

		// Scroll To
		$('#scrollDown').on('click', function(e) {
			e.preventDefault();
			var body = $("html, body"),
			height = $(window).height() - 60;
			body.animate({scrollTop: height}, '500', 'swing');
		});

		// Form mail
		$('#notify-mail').on('submit', function() {
			t.submitForm(this, t.notifyFormResponse);
			return false;
		});
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

var landing = 2;
$(document).ready(function() {
	window.a = new Landing();
});