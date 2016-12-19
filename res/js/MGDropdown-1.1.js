/**
* @class
*   simple dropdown
*
* @example
*    $(document).ready(function(){
*		$('.dropdown').MGDropdown({
*			changeTarget: ''
*		});
*	});
*
*
*
* @name jQuery.MGDropdown
* @author tyHa(mogle) <chickenoup@gmail.com>
* @since 2015년 6월 29일 월요일
* @version 1.1
*/

(function($){
		
	$.fn.MGDropdown = function(options) {
		defaults = {
			topMenuSelector: '.dropdown_top',
			subMenuSelector: '.dropdown_sub',
			onSubClick : onSubClick,
			changeTarget : $('body'),
			disableLink : true,
			onLoaded : null,
			post : null
		}; // defaults end;
		options = $.extend(defaults, options);

		return this.each(function(index){
			// toggle submenu
			$(options.topMenuSelector).click(function(){
				$(options.subMenuSelector).toggle();
			});
			
			// add last - line
			$('li:last-child',options.subMenuSelector).after('<hr>');

			// submenu event
			// disable link
			if (options.disableLink){
				$('a',options.subMenuSelector).css('pointerEvents','none');
			}
			
			$('li',options.subMenuSelector).click(function(){
				options.onSubClick(this);
			});
			
		}); // return each end;

		function onSubClick(clicked){
			var $goto = $(clicked).find('a').attr('href');
			if ($goto != ""){
				if (options.post != null)
				{
					$.post($goto,post,function(data){
						$(options.changeTarget).load(data);
					});
					
				}else{
					$(options.changeTarget).load($goto);
				}
				$('div',options.topMenuSelector).text($(clicked).find('a').text());
				$('li',options.subMenuSelector).removeClass('active');
				$(clicked).toggleClass('active');
			}
			
			return onLoaded();
		}
		function onLoaded(){
			if (options.onLoaded){options.onLoaded();}
			
			return $(options.subMenuSelector).toggle();
		}
	};	//function define end;

})(jQuery);