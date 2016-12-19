
$(function(){
	/* auto clone tableheader*/
	window.addListener('tableChange',autoFixTableHeader);
	$(window).resize(function(){
		triggerEvent('tableChange');
	});
});
function autoFixTableHeader(){
	$('.fixedHeader').remove();
	$('.tableHeader').each(function(idx,obj){
		var $cloned = $(obj).clone(true);
		$cloned.addClass('fixedHeader');
		$cloned.find('th').css('width',function(idx2,obj2){
			//console.log($(obj).find('th').eq(idx2).css('width'));
			return $(obj).find('th').eq(idx2).css('width');
		});
		$(obj).before($cloned);
	});
};

function sortBy($target,name,sign){
	sign = sign || 1;

	var array = [];
	$target.find('[name='+name+']').text(function(idx2,text){
		array[idx2] = new Object();
		array[idx2].key = text;
		array[idx2].obj = $target.has(this);
		return text;
	});
	array.sort(function(a,b){
		if(a.key > b.key) return 1*sign;
		else if(a.key < b.key) return -1*sign;
		else return 0;
	});
	for(var i = 0; i < array.length; i++){
		$('table').has($target).append(array[i].obj);
	}

}


/**
*	@name							paging
*	@descripton						data paging
*	@version						1.0.0
*	@requires						jQuery 1.2.6+
*
*	@author							Ha TaeYun
*	@author-email					chickenoup@naver.com
*
*/
function paging(options){
	var defaults = {
		source:null,
		scope:'body',
		startPage: 1,
		selectPage: 1,
		maxPage: 5,
		afterPaging:null,
		beforeFlush:null,
		dataShow:100
	};
	options = $.extend(defaults,options);
	if(options.source == null){
		$(options.scope).find('[class^=loading-],.loading-paging').hide();
		$($(options.scope).find('.pagination').attr('data-target')).find('tbody tr.tableRow:not(.skeleton)').remove();
		return console.error('paging : source no data');
	}
	// 페이징할 source를 무조건 array로 보고 array로 변경(키값이 있을때는 위험.)
	if(!Array.isArray(options.source)){
		options.source = objToArray(options.source);
	}

	cdebug('Paging set '+options.scope+","+options.startPage+","+options.selectPage+","+options.maxPage);

	/* pagination */
	if(!$(options.scope).find('.pagination').length)
		console.error('Scope Miss Error: ['+scope+']has not (.pagination) paging Failed');
	
	if(!$(options.scope).length)
		return console.error('Cannot find scope :'+options.scope);

	var $pagination = $(options.scope).find('.pagination');
	var $target = $($pagination.attr('data-target'));
	var _size = $target.attr('data-show') || options.dataShow;
	var _totalPageSize = Math.ceil(options.source.length/_size);

	// badge띄우기
	$('[data-target="'+$pagination.attr('data-target')+'"].badge').text(options.source.length);
	// 페이지 번호 설정
	$pagination.find('.page').remove();
	$pagination.find('li').addClass('disabled');
	$pagination.find('li,li *').unbind();
	var prev = $pagination.find('li.prev');
	var next = $pagination.find('li.next');
	for(var i = options.startPage; i <= _totalPageSize && i < options.startPage+options.maxPage; i++){
		next.before($("<li class='page' data-index="+i+"><a href='#'>"+i+"</a></li>"));
	}

	$pagination.find('.page[data-index='+options.selectPage+']').addClass('active');
	$pagination.find('li.page').each(function(idxof,item){
		$(item).click(function(){
			var newOptions = $.extend(options,{selectPage:$(this).attr('data-index')});
			paging(newOptions);
		});
	});
	// 넘어가고 줄어들고
	if( options.startPage > options.maxPage){
		prev.removeClass('disabled');
		prev.find('a').click(function(){
			cdebug('clickprev');
			var newOptions = $.extend(options,{
				startPage:options.startPage-options.maxPage,
				selectPage:options.startPage-1
			});
			paging(newOptions);
		});
	}
	if( options.startPage+options.maxPage < _totalPageSize){
		next.removeClass('disabled');
		next.find('a').click(function(){
			cdebug('clicknext');
			var newOptions = $.extend(options,{
				startPage:options.startPage+options.maxPage,
				selectPage:options.startPage+options.maxPage
			});
			paging(newOptions);
		});
	}
	
	// 페이지 내용 flush
	$target.find('tr.tableRow:not(.skeleton)').remove();

	// 원본 스코프 설정
	var $slicedSource = options.source.slice((options.selectPage-1)*_size,options.selectPage*_size);
	
	if(options.beforeFlush){
		$slicedSource = options.beforeFlush($slicedSource);
	}
	
	$target.append($slicedSource);
	$(options.scope).find('[class^=loading-],.loading-paging').hide();
	if(options.afterPaging)
		options.afterPaging();
}
/*
	target : target selector $ or ''
*/
function tableFiltering(options){
	var defaults ={
		source:null,
		target:'',
		before:function(){
			$('[id*=-find]').val('');
			$('[class^=loading-]').show();
		},
		after:null
	}
	options = typeof options == 'string' ? {target:options} : options;
	options = $.extend(defaults,options);
	
	if(!this.filteringConf)
		this.filteringConf = new Object();
	if(!this.filteringConf[options.target]){
		this.filteringConf[options.target] = new Object();
		this.filteringConf[options.target]['column'] = $(options.target).attr('data-target-column');
	}
	this.filteringConf[options.target]['filter'] = parseSelected(options.target);

	
	var $filtered_byFilter = options.source.slice(0);//$account_all.slice(0);

	for(var eachTarget in this.filteringConf){
		var targetColumn = this.filteringConf[eachTarget].column;
		var parsedFilter = this.filteringConf[eachTarget].filter;
		//필터링 시작
		
		console.log('startFiltering '+ targetColumn);
		console.log('Filter is '+ parsedFilter.toString());
		
		for(var idx in $filtered_byFilter){
			obj = $filtered_byFilter[idx];
			obj.remove = false;
			for(var i = 0; i < parsedFilter.length ;i++){
				if(obj.remove) break;
				var nokeyOK = parsedFilter[i][0][0] != '-';
				var remove = !nokeyOK; // 없으면 안될때는 지우라고 초기화
				for(var j = 1; j < parsedFilter[i].length ; j++){ // 1부터 하는이유는 '없는것도'때문
					if(obj.remove) break;
					var filterOrigin = parsedFilter[i][j];
					var negative = false;
					if( filterOrigin[0] == '-'){
						negative = true;
						filterOrigin = filterOrigin.substr(1);
					}
					
					if(negative){
						// 제외할키워든데 갖고있으면
						if( (Array.isArray(obj.keywords[targetColumn]) && obj.keywords[targetColumn].indexOf(filterOrigin) >= 0) || (!Array.isArray(obj.keywords[targetColumn]) && obj.keywords[targetColumn] == filterOrigin) ){
							obj.remove = true;
							break;
						}
					}else if(!nokeyOK && remove){ // 없으면안되는데 심지어 아직 찾지도못했어 (or)
						 // 갖고있으면
						if( (Array.isArray(obj.keywords[targetColumn]) && obj.keywords[targetColumn].indexOf(filterOrigin) >= 0) || (!Array.isArray(obj.keywords[targetColumn]) && obj.keywords[targetColumn] == filterOrigin) )
							remove = false;
					}
				}
				if(remove){ // 결국 지워야하면
					obj.remove = true;
					break;
				}
			}
			obj.remove = obj.remove.toString();
			$filtered_byFilter[idx] = obj;
		}
		console.log('table Filtering before end '+$filtered_byFilter.length);
		$filtered_byFilter = JSONFilter($filtered_byFilter,'remove=false');
		console.log('table Filtering end '+$filtered_byFilter.length);
		
		if($('.order .active',options.target).length){
			console.log('sorting');
			var order = $('.order .active',options.target).attr('data-value');
			if(order == 'desc')
				$filtered_byFilter.sort(function(a,b){
					return b[targetColumn].localeCompare(a[targetColumn]);
				});
			else
				$filtered_byFilter.sort(function(a,b){
					return a[targetColumn].localeCompare(b[targetColumn]);
				});
		}
	}
	if(options.after)
		options.after($filtered_byFilter);
	return $filtered_byFilter;
};