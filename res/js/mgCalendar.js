(function(jQuery){ 
	jQuery.fn.mgCalendar = function(options){
		defaults = {
			bodyClass:'mg-calendar-body'
		};
		options = $.extend(defaults, options);
		return this.each(function(){
			var $body = $(this).find('.'+options.bodyClass);
			if(!$body.length){
				$body = $("<div class='"+options.bodyClass+"'></div>");
				$(this).append($body);
			}
			

		});
	};
})(jQuery);