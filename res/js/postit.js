/*
*	this js requires
*/
var last_show_options;
function showPOST(options){
	//show_debug = true;
	var Scroll = window.scrollY;
	defaults = {
		key:'%',
		targetBox:'',
		after:null,
		startNum:0,
		showNum:20,
		append:false,
		postboxtype:'normal'
	};

	options = $.extend(defaults,options);
	
	options.targetBox = options.targetBox || 'postit-postbox';

	// empty box
	var $target = $('#'+options.targetBox);
	if(!options.append)
		$target.find('.post-item,.post-comment').remove();
	
	// set targetInfo
	if(!$target.find('#postit-postbox-target').length)
		$target.append("<input id='postit-postbox-target' type='hidden'/>");
	$target.find('#postit-postbox-target').val(options.key);
	$target.find('#postit-postbox-name').text($('li[data-show-target="'+options.key+'"] .item-name').text());
	var $inflatePlace = $target;
	
	// save last showoptions
	last_show_options = options;
	last_show_options.append = false;

	// getPosts
	$.post('?mid=mc_postit_postSkeleton.php',function(skeleton){
		var $skeleton = $(skeleton);
		var $repl_skeleton = $skeleton.find('.post_reply_item.skeleton');
		var $img_skeleton = $skeleton.find('.posted-img.skeleton');
		var $data_skeleton = $skeleton.find('.posted-data.skeleton');
		$skeleton.find('.skeleton').remove();
		cdebug('skeleton loaded find repl skeleton :'+$repl_skeleton.length);
		$.post('?proc=postit&method=read',{'key':options.key,showNum:options.showNum,startNum:options.startNum},function(data){
			data = getJSON(data);
			if(data.msg == 'isnotJSON') return console.error(data.content.substring(0,2000)+"...");
			if(!data.posts || !data.posts.length){ 
				$inflatePlace.find('.post-showmore').remove();
				return $inflatePlace.append("<span class='post-item'>메세지가 없습니다.</span>");
			}
			var hasRepls = true;
			if(!data.repls || !Object.keys(data.repls).length){hasRepls = false;}
			var hasLinks = true;
			if(!data.links || !Object.keys(data.links).length){hasLinks = false;}
			cdebug(data.posts.length);
			// 데이터 인플레이트
			for(var i = 0; i < data.posts.length; i++){
				cdebug(data.posts[i]);
				// pre edit;
				if(data.posts[i]['POST_TO_NAME'].contains('@') && data.posts[i]['POST_MEMB_NAME']){
					data.posts[i]['POST_TO_NAME'] = data.posts[i]['POST_MEMB_NAME'];
				}
				data.posts[i]['POST_SHOWCOUNT'] -= data.posts[i]['POST_SHOWNCOUNT'];

				var $data = mashSkeleton($skeleton,data.posts[i],true);
				
				// 리플달기
				if(hasRepls && data.repls[data.posts[i]['POST_ID']]){
					var _repls = data.repls[data.posts[i]['POST_ID']];
					cdebug("repl length "+_repls.length);
					for(var j = 0; j < _repls.length; j++){
						var $repl = mashSkeleton($repl_skeleton,_repls[j],true);
						$data.find('.post_reply_divline').after($repl);
					}
				}else
					$data.find('[class^=post_reply]').remove();
				// 데이터링크 달기
				if(hasLinks && data.links[data.posts[i]['POST_ID']]){

					var _links = data.links[data.posts[i]['POST_ID']];
					cdebug("link length "+_links.length);
					var _skeleton;
					var _divline;
					for(var j = 0; j < _links.length; j++){
						switch(_links[j]['POSTATT_TYPE']){
						case 'img':
							_skeleton = $img_skeleton;
							_divline = $data.find('.divline-img');
							break;
						default:
							_skeleton = $data_skeleton;
							_divline = $data.find('.divline-data');
						}
						var $link = mashSkeleton(_skeleton,_links[j],true);
						_divline.after($link);
					}
				}
				$inflatePlace.append($data);
			}
			//더보기 추가
			$inflatePlace.find('.post-showmore').remove();
			if(data.posts.length == options.showNum){
				$showMore = $("<div class='post-showmore'>더보기</div>");
				$showMore.click(function(){
					showPOST($.extend(options,{startNum:(parseInt(options.showNum)+parseInt(options.startNum)),append:true}));
				});
				$inflatePlace.append($showMore);
			}
			// 타입별 에디트아이콘
			$inflatePlace.find('.post-item.status-trash').filter(':not(.btn-arranged)').addClass('btn-arranged').find('.btn-edit:not(.btn-remove,.btn-revive)').remove();
			$inflatePlace.find('.post-item:has(input[name=POST_FROM_FILTER][value=me])').filter(':not(.btn-arranged)').addClass('btn-arranged').find('.btn-edit:not(.btn-trash,.btn-confirm,.btn-modify,.btn-detach)').remove();
			switch(options.postboxtype){
			case 'normal':
				$inflatePlace.find('.post-item:not(.btn-arranged)').find('.btn-edit:not(.btn-trash,.btn-confirm)').remove();
				break;
			case 'trash':
				$inflatePlace.find('.post-item:not(.btn-arranged)').find('.btn-edit:not(.btn-remove,.btn-revive)').remove();
				break;
			case 'sent':
			case 'public':
				$inflatePlace.find('.post-item:not(.btn-arranged)').find('.btn-edit:not(.btn-trash,.btn-confirm,.btn-modify,.btn-detach)').remove();
				break;
			case 'notice':
				$inflatePlace.find('.post-item:not(.btn-arranged)').find('.btn-edit:not(.btn-confirm)').remove();
				break;
			}
			// 뱃지제거
			$inflatePlace.find('.post-item:has(input[name=POST_SHOWCOUNT][value=0]) .badge').text('');
			
			// 이미지 줌 이벤트
			postedImgZooming($inflatePlace);
			if(options.after && typeof options.after == 'function')
				options.after(data.posts);

		});
	});

}
function movePost(_this){
	var $postItem = $('.post-item').has(_this);
	$postItem.css('z-index',new Date().getTime()%100000);
	$postItem.addClass('absolute');
	$('*').addClass('unselectable');
	_this.moving = true;
	move(event);
	$(document).mousemove(move);
	$(document).mouseleave(stopMove);
	$(document).mouseup(stopMove);
	
	function move(e){
		if(_this.moving){
			
			$postItem.offset({
				left:e.clientX,
				top: e.clientY+$('body').scrollTop()
			});
		}
	}
	function stopMove(e){
		$('*').removeClass('unselectable');
		_this.moving = false;
	}
}
function resizePost(_this){
	var $postItem = $('.post-item').has(_this);
	$postItem.css('z-index',new Date().getTime()%100000);
	$('*').addClass('unselectable');
	_this.resizing = true;
	$(document).mousemove(resize);
	$(document).mouseleave(stopResize);
	$(document).mouseup(stopResize);
	
	function resize(e){
		if(_this.resizing && _this.X){
			$postItem.width($postItem.width()+(e.screenX-_this.X));
		}
		_this.X = e.screenX;
	}
	function stopResize(e){
		$('*').removeClass('unselectable');
		_this.resizing = false;
	}
}

function postedImgZooming(target){
	$(target).find('.posted-img>img').css('cursor','pointer').click(function(){
		var src = $(this).attr('src');
		var $frame = $('#zooming-frame');
		if(!$frame.length){
			var _frame = document.createElement('div');
			_frame.id = 'zooming-frame';
			document.body.appendChild(_frame);
			$frame = $('#zooming-frame');
			$frame.append("<img style='max-width:100%;max-height:100%;' src='"+src+"'/>");
		}
		$.colorbox({
			inline:true,
			title:"PostImg",
			href:'#zooming-frame',
			maxWidth:'100%',
			maxHeight:'100%',
			onComplete:function(){
				$('#cboxLoadedContent').zoom({
					url:src,
					on:'click',
					magnify:2
				});
			},
			onClosed:function(){
				$frame.remove();
			}
		});
	});
};

function detachItem(_this){
	var id = $(_this).attr('data-value');
	
	bootConfirm('정말 이 파일을 삭제하시겠습니까? 영영 사라져버립니다.',function(){
		$.post('./?proc=postit&method=detach_item',{'POSTATT_ID':id},function(data){
			data = getJSON(data);
			if(data.result== true){
				showPOST(last_show_options);
			}else{
				bootAlert('Failed',data.content || data,'danger');
			}
		});
	},{type:'danger',title:'Detach Attachment'})
};

function reviveItem(_this){
	var id = $(_this).attr('data-value');
	
	bootConfirm('해당 포스트잇을 복원합니까?',function(){
		$.post('./?proc=postit&method=revive',{'POST_ID':id},function(data){
			data = getJSON(data);
			if(data.result== true){
				showPOST(last_show_options);
			}else{
				bootAlert('Failed',data,'danger');
			}
		});
	},{type:'info',title:'Revive Post'})
};
function deleteItem(_this){
	var id = $(_this).attr('data-value');
	
	bootConfirm('정말 삭제하시겠습니까? 영영 사라져버립니다.',function(){
		$.post('./?proc=postit&method=delete_post',{'POST_ID':id},function(data){
			data = getJSON(data);
			if(data.result== true){
				if(data.attachResult.length){
					bootAlert('danger',data.attachResult.join('<br>'),'warning',50000);
				}
				showPOST(last_show_options);
			}else{
				bootAlert('Failed',data.content || data,'danger');
			}
		});
	},{type:'danger',title:'Delete Post'})
};
function trashItem(_this){
	var id = $(_this).attr('data-value');
	
	bootConfirm('휴지통으로 이동합니까?',function(){
		$.post('./?proc=postit&method=goTrash',{'POST_ID':id},function(data){
			data = getJSON(data);
			if(data.result == true){
				showPOST(last_show_options);
			}else{
				bootAlert('Failed',data,'danger');
			}
		});
	},{type:'danger',title:'Go Trashcan'})
}

function modifyItem(_this){
	var id = $(_this).attr('data-value');
	var $this = $('.post-item').has(_this);
	
	$.colorbox({
		title:"Edit post",
		href:'?mid=mc_postit_postForm.php',
		onComplete:function(e){
			var $form = $('#postForm');
			$('input[name=POST_ID]',$form).val(id);
			//컬러체인지
			$('.dropdown-menu.color-selector li a[data-pointer='+$this.find('input[name=POST_COLOR]').val()+']',$form).trigger('click');

			$('input[name=POST_TO],#postForm #POST_FROM',$form).attr('readonly','');
			$('input[name=POST_DATA_PATH]',$form).hide();

			$('input[name=POST_TO]',$form).val($this.find('[name=POST_TO]').val());
			$('input[name=POST_TITLE]',$form).val($this.find('[name=POST_TITLE]').text());
			$('textarea[name=POST_CONTENT]',$form).val($this.find('[name=POST_CONTENT]').text());
		}
	});
	
};

function confirmItem(_this){
	var id = $(_this).attr('data-value');
	
	bootConfirm("5자 이상 (신중하게 입력하세요.)<br><span class='btn btn-xs btn-default' onclick='$(\"#prompt-input\").val(\"확인했습니다.\");'>확인했습니다.</span>",function(prompted){
		prompted = prompted.val() || '';
		$.post('./?proc=postit&method=confirm_post',{'POST_ID':id,'POSTREPL_CONTENT':prompted},function(data){
			if(data>0){
				showPOST(last_show_options);
			}else{
				bootAlert('Failed',data,'danger',null,5000);
			}
		});
	},{title:"Reply",promptObject:$("<input id='prompt-input' type='text' class='form-control'/>"),promptCondition:function(obj){
		if(obj.val().length < 5){return false;}
		return true;
	}});
	
};

function postTo(to){
	var _target = to || $('#postit-postbox-target').val();
	switch(_target){
	case 'trash': _target = ''; break;
	case '%': _target = 'all'; break;
	}
	$.colorbox({
		title:"Posting to",
		href:'?mid=mc_postit_postForm.php&POST_TO='+_target
	});
}

function toggleExpand(id){
	$('#postbox_'+id).find('.hidden,.show').toggleClass('show').toggleClass('hidden');
	$('#postbox_'+id).find('.showmore').toggleClass('active');
}
