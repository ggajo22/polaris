/**
* @class
*   좌우 롤링 기능 처리
*
* @example
*    $(document).ready(function(){
*		$('.mg_rolling_slider').MGRollingSlide({
*			loadPath:"http://jangsuhanoo.cafe24.com/product/list.html?cate_no=62"
*		});
*	});
*
*
*
* @name jQuery.MGRollingSlide
* @author tyHa(mogle) <chickenoup@gmail.com>
* @since 2015년 4월 30일 목요일
* @version 1.0
*/
(function($){
		
		$.fn.MGRollingSlide = function(options) {
				
			defaults = {
				selector_this:this,
				listClass:'.mg_rollinglist',
				loadPath:false,
				loadClass:'xans-product-listnormal',
				imageWidthPer:'0.30',
				imageWidth:'200px',
				imageWidthByPer:true,
				imagePaddingTop: 0,
				imagePaddingRight: 0,
				imagePaddingBottom: '30px',
				imagePaddingLeft: '20px',
				imagePaddingLeftPer:'0.049',
				imagePaddingLeftByPer:true,
				rollingSpeed: 25,
				rollingSpeedAccelRatio: 3,
				rollingDuration: 500,
				rollingDirection:'-',
				leftImageUrl:'./img/rollingslide_arrow_L_shadow.png',
				rightImageUrl:'./img/rollingslide_arrow_R_shadow.png',
				arrowPosition:'inner',
				panelExtendRatio : 4,
                onLoaded: null
			};
			options = $.extend(defaults, options);

			return this.each(function(){
				var $masterWindow = $(options.selector_this);
				$masterWindow.html('');
				$masterWindow.append("<ul class='"+options.listClass.replace('.','')+"'></ul>");
				var $rollingList = $masterWindow.find(options.listClass);
				var $panelSize;
				
				/* general css set */
				
				$masterWindow.css("overflow","hidden").css("clear","both").css('position','relative');

				if (options.loadPath)
				{
					$.get(options.loadPath,function(data){
						$masterWindow.find(options.listClass).html(options.loadClass? $(data).find('.'+options.loadClass+' ul').html() : data );
						init();
					});	
				}else
					init();
                
				function init(){
				
					/* percentage로 이미지 넓이 설정 */
					if (options.imageWidthByPer)
						options.imageWidth = (options.imageWidthPer * parseInt($masterWindow.css('width')))+'px';
					if (options.imagePaddingLeftByPer)
						options.imagePaddingLeft = (options.imagePaddingLeftPer * parseInt($masterWindow.css('width')))+'px';

					/* set image width and Padding */
					$masterWindow.find('li').css('float','left').css('width',options.imageWidth);
					$masterWindow.find('li').css('paddingTop',options.imagePaddingTop);
					$masterWindow.find('li').css('paddingRight',options.imagePaddingRight);
					$masterWindow.find('li').css('paddingBottom',options.imagePaddingBottom);
					$masterWindow.find('li').css('paddingLeft',options.imagePaddingLeft);

					/* rollinglist css 설정 */
					var $listSize = ( (parseInt(options.imageWidth)+parseInt(options.imagePaddingRight)+parseInt(options.imagePaddingLeft)+1) * $rollingList.find('li').length );
					
					$masterWindow.css('height',$masterWindow.find('li').height());
					$rollingList.css('position','absolute').css('display','inline-block').css('float','left').css('overflow','hidden').css('width',$listSize);
					
					/* list clone */
					if ($rollingList.width() * $masterWindow.find(options.listClass).length > 0)
					{
						do{
						var $cloned = $rollingList.clone();
						$rollingList.after($cloned);
						$rollingList = $masterWindow.find(options.listClass).filter(':last').offset({ left: $rollingList.offset().left+$rollingList.width() });
						}while( $rollingList.width() * $masterWindow.find(options.listClass).length < ($masterWindow.width()+$rollingList.width()) );
					
					}
					
					
					
					/* add arrow */
					$("<div class='mg_left'><img src='"+options.leftImageUrl+"'/></div>").prependTo($masterWindow);
					$("<div class='mg_right'><img src='"+options.rightImageUrl+"'/></div>").prependTo($masterWindow);
					/* set arrow css */
					var $mg_left = $('.mg_left',options.selector_this);
					var $mg_right = $('.mg_right',options.selector_this);
					
					/* arrow position setting */
					
					if ($masterWindow.outerHeight() > 40*2)
					{
						$mg_left.find('img').css('marginTop',( $masterWindow.outerHeight() - $mg_left.find('img').height() ) / 2 );
						$mg_right.find('img').css('marginTop',( $masterWindow.outerHeight() - $mg_right.find('img').height() ) / 2 );
					
					}
					
					/* defaults */
					$mg_left.css('position','absolute').css('zIndex',10).css('height',$masterWindow.height());
					$mg_right.css('position','absolute').css('zIndex',10).css('height',$masterWindow.height());
					if ($mg_right.find('img').width() > 0){
						$mg_right.css('left',$masterWindow.outerWidth()-($mg_right.find('img').width()) );
					}else{
						$mg_right.css('left',$masterWindow.outerWidth()-30);
					}
					
					
					if (options.arrowPosition == 'outer'){
						
						$mg_left.css('left',-($mg_left.find('img').width()) );
						$mg_right.css('left',$masterWindow.outerWidth() );
					}
					/* add arrow function */
					
					$mg_left.hover(function(){rollingFaster({direction:'-'});},function(){rollingSlower();});
					$mg_right.hover(function(){rollingFaster({direction:'+'});},function(){rollingSlower();});
					
					

					/* window hover */
					
					$masterWindow.find(options.listClass).hover(function(){
						stopRolling();
					},function(){
						rollAll();
					});
					rollAll();
					if(options.onLoaded){
                        options.onLoaded();
                    }
				
				};
				
				
				function rollAll(){
					$masterWindow.find(options.listClass).each(function(){
						rollingItem($(this));
					});
				};

				function rollingItem(selector){
					rollOver(selector);
					/* rolling */
					selector.clearQueue().animate({
						left: options.rollingDirection+"="+options.rollingSpeed
					},options.rollingDuration,"linear",function(){
						rollingItem(selector);
					});
				};

				function rollOver(selector){
					/* rollOver right*/
					if ( (options.rollingDirection == '+') && (selector.offset().left > ( $masterWindow.offset().left + $masterWindow.width() )) )
					{
						var $leftest = selector;
						$masterWindow.find(options.listClass).each(function(){
							if ($leftest.offset().left > $(this).offset().left)
							{
								$leftest = $(this);
							}
						});
						selector.offset( {left : ($leftest.offset().left - selector.width()) } );
					}
					/* rollOver left*/
					else if ( (options.rollingDirection == '-') && (selector.offset().left < $masterWindow.offset().left - selector.width()) )
					{
						var $rightest = selector;
						$masterWindow.find(options.listClass).each(function(){
							if ($rightest.offset().left < $(this).offset().left)
							{
								$rightest = $(this);
							}
						});
						selector.offset( {left : ($rightest.offset().left + selector.width()) } );
					}
				}
				
				function stopRolling(){
					$(options.listClass).clearQueue().stop();
				};

				function changeDirection(dir){
					options.rollingDirection = dir;
				};
				function rollingFaster(option){
                    if(option){
                        if (option.direction)
                            changeDirection(option.direction);
                    }
					stopRolling();
					options.rollingSpeed *= options.rollingSpeedAccelRatio;
					rollAll();
					
				};
				function rollingSlower(){
					stopRolling();
					options.rollingSpeed /= options.rollingSpeedAccelRatio;
					rollAll();
				};

			});
		};
})(jQuery);