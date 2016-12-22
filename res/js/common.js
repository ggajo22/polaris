function getScript(_url){
	$.ajax({
	  url: _url,
	  async: false,
	  dataType: "script"
	});
}
$(function(){
	/* auto colorbox event */
	$("[data-colorbox-inline]").click(function(){
		var $inline = $($(this).attr("data-colorbox-inline"));
		if( $(this).is('[data-colorbox-before]') ){
			eval($(this).attr('data-colorbox-before')+'($inline);');
		}
		var _onComplete = null;
		if( $(this).is('[data-colorbox-oncomplete]') ){
			_onComplete = eval($(this).attr('data-colorbox-oncomplete')+'($inline);');
		}
		var options = {
			inline:true,
			href:$inline,
			maxWidth:'100%',
			onComplete:_onComplete,
		};
		if( $(this).is('[data-colorbox-options]') ){
			options = $.extend(options,eval($(this).attr('data-colorbox-before')));
		}

		$.colorbox(options);
	});

});
//cookies
function getCookie(c_name){
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++){
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name){
		return unescape(y);
		}
	}
}
function setCookie(c_name,value,exdays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie = c_name + "=" + c_value;
}

function submitVirtualForm(options){
	var tempForm = document.createElement('form');
	tempForm.action = options.action;
	tempForm.method = options.method;
	for(var key in options.inputs){
		var tempInput = document.createElement('input');
		tempInput.name = options.inputs[key].name;
		tempInput.value = options.inputs[key].value;
		tempForm.appendChild(tempInput);
	}
	return tempForm.submit();
}

function ajaxSubmit(form,after,before){

	if(before){
		var changed = before(form,doSubmit);
		if(changed === false)
			return false;
		form = !!changed?changed:form;
	}

	function doSubmit(){
		options = {
			success : after
		};
		$(form).ajaxSubmit(options);
	}
	doSubmit();

	return false;
};
//event listener
function addListener(even,func){
	if(!window[even])
		window[even] = new Array();
	window[even].push(func);
}

function triggerEvent(even){
	for(var i = 0; i < window[even].length; i++){
		window[even][i]();
	}
}

function settingNotification(){
	if(("Notification" in window)){

		if(Notification.permission !== "granted"){
			Notification.requestPermission().then(function (permission) {
				bootAlert("Danger",
"크롬 세팅 알람설정을 허용해주세요!<br>주소창에 [<input onmousedown='$(this).select();' onmouseup='document.execCommand(\"copy\");alert(\"복사되었습니다. 주소창에 붙여넣기 하세요\")' value='chrome://settings/contentExceptions#notifications'</input>]<<클릭시복사"
				,"danger",function(){},100000);
			});
		}
	}
};
/**
*	@roll							set item lower text to [name=LOWER_KEYWORD]
*/
function setLowerKeyword($target){
	if($target.is('tr')){
		cdebug('setLowerKeyword [tr]');
		$target.text(function(idx,text){
			if(text != null)
				$('[name=LOWER_KEYWORD]',this).text(text.toLowerCase().trim().replace(/[\s ]/gi,''));
			//return text;
		});
	}
	return $target;
};
/* revive */

/**
*	@name							mashSkeleton
*	@descripton						blooding skeleton with data
*	@version						1.0.0
*	@requires						jQuery 1.2.6+
*
*	@author							Ha TaeYun
*	@author-email					chickenoup@naver.com
*
*	@params							1. skeleton for mashing (must include .skeleton)
*									2. data for bleeding
*									3. target for data inflating
*									4. after mashing
*/
function mashSkeleton(skeleton, data, inflateTarget, after, isJson){
	//default
	if(inflateTarget === true){ isJson = true; inflateTarget = false}
	inflateTarget = inflateTarget || '[name]';
	if(!$(skeleton).length){
		console.error('Skeleton MissAssignError : '+skeleton);
	}
	var cloned = $(skeleton).clone(true);

	cloned.removeClass('hidden skeleton');
	cloned.find('[class*=has]').removeClass('hastransformer');
	/* 데이터가 있으면 */
	if(data && !data.originalEvent){
		var datas = isJson ? data : getArrayData($(data).find('[name]'));
		inflateSkeleton(datas,cloned); // cloned object body.
		cloned.find(inflateTarget).each(function(idx,obj){
			inflateSkeleton(datas,obj);
		});
	}

	$('.skeleton',cloned).remove();
	if(after)
		after(cloned);

	return cloned;
}
function inflateSkeleton(datas,obj){ // derived from mashSkeleton

	var _name = $(obj).getName();
	var val = datas[_name];
	if(!val) return;// 매칭되는 데이터 없음
	if(_name.contains('[]')){
		if(typeof val !== 'object') return;
		//console.log(val);
		for(var i = 0 ; i < val.length; i++){
			var $inner = mashSkeleton(obj,val[i],true);
			$(obj).after($inner);
		}
		return;
	}

	// pre fix
	if($(obj).is('[data-inflate-prefix]')){
		val = $(obj).attr('data-inflate-prefix')+val;
		$(obj).removeAttr('data-inflate-prefix');
	}

	// inflate
	if($(obj).attr('data-inflate') == 'tooltip'){
		$(obj).attr('data-original-title',val);
	}else if($(obj).is('[data-inflate=class]')){
		$(obj).addClass(val);
	}else if($(obj).is('[data-inflate]')){
		var _position = $(obj).attr('data-inflate-position') || 'replace';
		var _place = $(obj).attr('data-inflate');
		_place = _place.split(',');
		for(var i = 0; i < _place.length; i++){
			switch(_place[i]){
			case 'text':
				$(obj).text(val);
				break;
			default:
				var _original = $(obj).attr(_place[i]) || '';
				switch(_position){
				case 'replace':
					$(obj).attr(_place[i],val);
					break;
				case 'prepend':
					$(obj).attr(_place[i],val+_original);
					break;
				case 'append':
					$(obj).attr(_place[i],_original+val);
					break;
				}
				break;
			}
		}

	}else{
		var tag = $(obj).tagName();
		switch(tag){
		case 'INPUT' :
		case 'TEXTAREA' :
		case 'SELECT':
			$(obj).val(val);
			break;
		case 'A':
			if($(obj).is('[data-href-inflate=append]')){
				var originVal = $(obj).attr('href');
				var postfix = '';

				if($(obj).is('[data-postfix]')){
					postfix = $(obj).attr('data-postfix');
				}
				$(obj).attr('data-original-value',val);
				$(obj).attr('href',originVal+val+postfix);
			}
			break;
		default:
			$(obj).html(val);
			break;
		}
	}
}
/**
*	@roll		check is JSON
*/
function sendLog(data){
	$.post('?proc=function&method=sendlog',{'logData':data},function(res){
		console.log("logsended "+res);
	});
}
function isJSON(data){
	try {
		JSON.parse(data);
	} catch (e) {
		return false;
	}
	return true;
}
function getJSON(data){
	if(isJSON(data)) return JSON.parse(data);
	return {'msg':'isnotJSON','content':data,'proc':'danger'};
}
function procJSON(jsonData,options){
	var defaults = {
		isnotJSON:function(){
			bootAlert('isnotJSON',JSON.stringify(jsonData).toHTML(),'danger',50000);
			console.error(JSON.stringify(jsonData));
			sendLog(jsonData);
		}
	};
	options = $.extend(defaults,options);

	if(options[jsonData.msg])
		options[jsonData.msg].call();
	else if(options['default']){
		options['default'].call();
	}else{
		console.error('procJSON: cannot process msg '+jsonData.msg);
		bootAlert('Danger',JSON.stringify(jsonData),'danger',50000);
	}
}

function parseSelected(selector){
	var typeSelected = new Array();
	$('ul[name=OPTI_TYPE]',selector).each(function(idx,obj){
		var inner = new Array();
		$(obj).find('li>span').text(function(idx2,txt){
			var temp = txt;
			if(!$(this).is('.active')){
				temp = '-'+txt;
			}
			inner.push(temp);
			return txt;
		});
		if(inner.length > 0){
			typeSelected.push(inner);
		}
	});

	return typeSelected;
}

/* 딜레이 후에 실행하는 함수*/
function delay(afterDelay,time,dontClear){
	cdebug('delayed function '+ afterDelay.name +' ='+time);
	time = time || 500;
	if(!dontClear)
		window.clearTimeout(this.tempAfterDelay);
	this.tempAfterDelay = window.setTimeout(afterDelay,time);
};
/* arr join(String) */
function stringJoin(arr1,arr2,separator){
	var arr = new Array();
	separator = separator || ' ';
	if( arr2.length == 0){
		return arr1;
	}
	for(var i = 0; i < arr1.length; i++){

		for (var j = 0; j < arr2.length ; j++ ){
			arr.push(arr1[i]+separator+arr2[j]);
		}
	}
	return arr;
}
/* target부분을 script포함 ajax reload */
function reloadArea(options){
	if (!options || !options.to){
		console.log('[reloadArea]failed');
		return;
	}
	options.href = options.href || location.href;

	if(Contains(options.href,'#')){
		console.log('reloadArea : options.href contains "#" auto cutting text on right');
		console.log('reloadArea : '+options.href);
		options.href = options.href.toString().substr(0,options.href.toString().indexOf('#'));
		console.log('reloadArea : '+options.href);
	}

	options.postData = options.postData ||{};
	options.from = options.from || options.to;
	options.onload = options.onload || function(){};
	options.params = options.params || '';
	console.log('reloadArea :'+options.href+options.params);
	$.post(options.href+options.params,options.postData,function(returnData){
		$(options.to).html($(returnData).find(options.from).html());
		console.log('reloadArea to :'+options.to+' | from '+ options.from);
		//console.log($(returnData).find(options.from).html());
		options.onload();
	});
}
/* 펑션 할당 */
function assignClick(selector){
	cdebug('['+arguments.callee.name+':'+$(selector).selector+']');
	$(selector).filter('[data-click]:not(.click-assigned):not(.skeleton)').each(function(i,obj){
		var _funcName =$(obj).attr('data-click');
		if (_funcName){
			$(obj).css('cursor','pointer');
			var selector = $(obj).attr('data-selector');
			if (selector){
				$(obj).find(selector).click(eval(_funcName));
			}else
				$(obj).click(eval(_funcName));
			$(obj).addClass('click-assigned');
		}
	});
}
function assignChange(selector){
	cdebug('['+arguments.callee.name+':'+$(selector).selector+']');
	$(selector).filter('[data-change]:not(.change-assigned):not(.skeleton)').each(function(i,obj){
		var _funcName =$(obj).attr('data-change');
		if (_funcName){
			$(obj).css('cursor','pointer');
			var selector = $(obj).attr('data-selector');
			if (selector){
				$(obj).find(selector).change(eval(_funcName));
			}else
				$(obj).change(eval(_funcName));
			$(obj).addClass('change-assigned');
		}
	});
}
function assignHover(selector){
	cdebug('['+arguments.callee.name+':'+$(selector).selector+']');
	$(selector).filter('[data-hover]:not(.hover-assigned):not(.skeleton)').each(function(i,obj){
		var _funcName =$(obj).attr('data-hover');
		if (_funcName && Contains(_funcName,',')){
			var splitab = _funcName.split(',');
			$(obj).css('cursor','pointer');
			var selector = $(obj).attr('data-selector');

			if (selector){
				$(obj).find(selector).hover(eval(splitab[0]),eval(splitab[1]));
			}else
				$(obj).hover(eval(splitab[0]),eval(splitab[1]));
			$(obj).addClass('hover-assigned');
		}
	});
}
/* tabchange */
function changeTab(liName,navid){
	if($showing){
		$('li','#'+navid).removeClass('active');
		$('li[name='+liName+']','#'+navid).toggleClass('active');
	}else{
		$('li:first','#'+navid).toggleClass('active');
	}
}

/* list를 초이스해서 타겟에 append */
function choiceList(){
	var $myParent = $('[data-click=choiceList]').has(this);
	var _index;
	var $target = $($myParent.attr('data-target'));
	var seperator = $myParent.attr('data-seperator') || ',';
	var $list = $target.val().split(seperator);
	var contain = false;

	for(var i = $list.length-1; i >= 0 ; i--){
		$list[i] =	$list[i].trim();
		if (!$list[i].length || $list[i] == $(this).text()){

			if ($list[i] == $(this).text()){
				contain = true;
			}
			$list.splice(i,1);
		}
	}
	if (!contain){
		$list.push($(this).text());
		$(this).addClass('active');
	}else{
		$(this).removeClass('active');
	}
	$target.val('');
	for (var i = 0; i < $list.length ; i++){
		if (i > 0){$target.val($target.val()+seperator.trim()+' ');}
		$target.val($target.val()+$list[i]);
	}
};

/* 부모찾기 */
function bottomUpFind(origin,goal){
	var target;
	for (target = origin.parent();!target.is($(goal)) ; target = target.parent()){
		if (target.tagName() == 'BODY' || !target){
			console.log('Cant find target');
			target = null;
			break;
		}
	};
	return target;
};
/* data 파싱 */
function parseMacro(item,dataselector,append){
	var arr = new Array();
	item.each(function(index){
		arr[index] = getArrayData($(this).find(dataselector),append);
	});
	return arr;
}


function getArrayData(objectTarget,append){
	var arr = new Object();
	$(objectTarget).each(function(index,obj){
		if($(obj).is('.s-only')) return;
		var tagName = $(obj).tagName();
		var objName = $(obj).getName();
		var value = null;
		if($(obj).is('[data-value]')){
			value = $(obj).attr('data-value');
		}else if ($(obj).is('[data-original]')){
			value = $(obj).attr('data-original');
		}else if ($(obj).attr('data-inflate') == 'tooltip'){
			value = $(obj).attr('data-original-title');
		}else if (tagName =='INPUT'){
			if($(obj).getInputType()=='checkbox'){
				value = $(obj).is(':checked')+"";
			}else if($(obj).getInputType()=='radio'){
				if($(obj).is('.onoff')){
					value = "";
					if($(obj).is(':checked')){
						value = "on";
					}
				}else if ($(obj).is(":checked")){
					value = $(obj).val();
				}
			}else
				value = $(obj).val();
		}else if(tagName =='DIV' || $(obj).is('[data-type=html]')){
			value = $(obj).html();
		}else if(tagName =='SPAN' || tagName =='TD'){
			value = $(obj).text();
		}else{
			value = $(obj).val();
		}
		//console.log('getArrayData['+$(obj).tagName()+':'+$(obj).getName()+'](value)->'+value);
		if(value != null){
			value = value.trim().replace("　","");
			if(!arr[objName])
				arr[objName] = value;
			else if(append)
				arr[objName] += ','+value;
			else{
				console.log('duplicate objName = '+objName);
			}
		}

	});
	/* checking object is empty */
	var isEmpty = true;
	for(var key in arr){
		if (arr[key] != ''){
			isEmpty = false;
		}
	}
	if(isEmpty)
		console.log('getArrayData['+$(objectTarget).getName()+'](isEmpty)->'+isEmpty);
	if(isEmpty)
		return new Object();
	else
		return arr;
}

function preventCopyPaste(selector){
	$(selector).bind('copy paste', function (e) {
       e.preventDefault();
    });
}
function tabRedirect(selector){
	if (event.keyCode == 9){
		event.preventDefault();
		return $(selector).focus().click();
	}
}
function enterRedirect(selector){
	if (event.keyCode == 13){
		event.preventDefault();
		return $(selector).focus().click();
	}
}

function bootAlert(title,message,type,ondismiss,duration){
	// type description
	// warning, danger, success, info, primary
	if (typeof type == 'function'){
		ondismiss = type;
		type = null;
	}
	var typedesc = ['warning','danger','success','info','primary'];
	for (var i = 0; i < arguments.length ; i++ ){
		for(var j = 0; j < typedesc.length; j++){
			if(typeof arguments[i] == 'function'){
				ondismiss = arguments[i];
			}else if(typeof arguments[i] == 'number'){
				duration = arguments[i];
			}
			if(arguments[i] == typedesc[j]){
				arguments[i] = '';
				type = typedesc[j];
				break;
			}
		}
	}
	if (!title)		{if (type){	title = type;} else title = '';}
	if (!message || typeof message == 'number')	{message = '';}

	if (!type)		{type = 'warning';}

	if (ondismiss && typeof ondismiss != 'function' && typeof ondismiss == 'number'){
		duration = ondismiss;
	}
	if (!duration){	duration = 2000;}


	var $newAlert = document.createElement("div");
	//$newAlert.classList.add('hidden');
	$newAlert.classList.add('alert');
	$newAlert.classList.add('alert-'+type);
	$newAlert.innerHTML = "<strong>"+title+"</strong> "+message;
	$newAlert.style.position = 'absolute';
	$newAlert.style.zIndex = '10000';
	$newAlert.style.left = '50%';
	$newAlert.style.top = '50%';
	$newAlert.style.margin = '0';
	$newAlert.style['margin-left'] = '-50%';
	$newAlert.style['max-width'] = '100%';
	$newAlert.style['max-height'] = '100%';
	$newAlert.style['overflow'] = 'auto';
	$newAlert.style.cursor = 'pointer';
	document.body.appendChild($newAlert);
	$($newAlert).animate({top:'+='+window.scrollY},0);
	$($newAlert).click(bye);

	$('input').focus(bye);
	$($newAlert).css('margin-left','-'+parseInt($($newAlert).css('width'))/2+'px');
	$($newAlert).css('margin-top','-'+parseInt($($newAlert).css('height'))/2+'px');

	$($newAlert).delay(duration).fadeOut(500,function(){
		$($newAlert).remove();
		if (ondismiss && typeof ondismiss == 'function'){ondismiss(); ondismiss = null;}
	});

	function bye(){
		$($newAlert).clearQueue().fadeOut(300,function(){
			$($newAlert).remove();
			if (ondismiss && typeof ondismiss == 'function'){ondismiss(); ondismiss = null;}
		});
	}
	return false;

}
function bootConfirm($message,$onConfirm,options){
	var defaults = {
		onClose : function(){},
		onClosed : function(){},
		onConfirm : $onConfirm,
		title: 'Confirm',
		type:'warning',
		promptObject: null,
		promptCondition:function(){return true;},
		negativeMessage:'조건을 충족하지 않습니다.',
		afterInflate : function(){},
		keyListen:true
	};
	options = $.extend(defaults, options);
	var $newConfirm = document.createElement("div");
	$newConfirm.classList.add('bootalert');
	$newConfirm.classList.add('alert');
	$newConfirm.classList.add('alert-'+options.type);
	$newConfirm.classList.add('alert-dismissible');
	$newConfirm.classList.add('fade');
	$newConfirm.classList.add('in');
	$newConfirm.style.position = 'absolute';
	$newConfirm.style.zIndex = '10000';
	$newConfirm.style.left = '50%';
	$newConfirm.style.top = '50%';
	$newConfirm.style.margin = '0';
	$newConfirm.style.cursor = 'pointer';
    $newConfirm.innerHTML += "	<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>×</span></button>";
    $newConfirm.innerHTML += "	<h4>"+options.title+"</h4>";
    $newConfirm.innerHTML += "	<p class='message' style='max-height:300px;overflow:auto;'>"+$message+"</p>";
	$newConfirm.innerHTML += "	<p>";
	$newConfirm.innerHTML += "		<button data-role='confirm' type='button' class='btn btn-"+options.type+"' data-dismiss='alert'>OK</button>";
    $newConfirm.innerHTML += "		<button data-role='close' type='button' class='btn btn-default' data-dismiss='alert'>Cancel</button>";
	$newConfirm.innerHTML += "	</p>";
	$('.bootalert').remove();
	document.body.appendChild($newConfirm);
	$($newConfirm).focus();
	if(options.keyListen){ // 키 리스닝 이벤트 추가
		$(document).keyup(keyListening);
	}

	if(options.promptObject){
		$($newConfirm).find('.message').after(options.promptObject);
		$(options.promptObject).width('300');
		$(options.promptObject).keyup(function(){enterRedirect('.bootalert [data-role=confirm]');});
		$(options.promptObject).focus();
	}else
		options.promptObject = $newConfirm;
	$($newConfirm).css('min-width','300px');
	$($newConfirm).css('-webkit-transform','translatex(-50%)')
		.css('-moz-transform','translatex(-50%)')
		.css('-ms-transform','translatex(-50%)')
		.css('-o-transform','translatex(-50%)')
		.css('transform','translatex(-50%)');
	$($newConfirm).css('margin-top','-'+parseInt($($newConfirm).css('height'))/2+'px');

	$($newConfirm).on('closed.bs.alert',options.onClosed);
	$($newConfirm).on('close.bs.alert',options.onClose);
	$($newConfirm).animate({top:'+='+window.scrollY},0);
	$('[data-role=confirm]').click(function(){
		$('[data-role=close]',$newConfirm).trigger('click');
		if(options.promptCondition(options.promptObject)){
			options.onConfirm(options.promptObject);
		}else{
			bootAlert("I can't do",options.negativeMessage,'danger');
		}
	});
	if(options.afterInflate){ // on Complete
		options.afterInflate($newConfirm);
	}
	// 사라질때 키리스닝 unbind
	$($newConfirm).on('closed.bs.alert',function(){
		$(document).unbind('keyup',keyListening);
	});

	function keyListening(e){
		switch(e.keyCode){
		case 27: // esc
			$('[data-role=close]',$newConfirm).trigger('click');
			break;
		case 13: // enter
			$('[data-role=confirm]',$newConfirm).trigger('click');
			break;
		}
	};
	return false;
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
/* protoType */
/* object handler*/
/*
	@roll	arr를 obj 키 순서에따라 차례대로 입력
*/
function removePairFromObjarr(objarr,key){
	var _newObjarr = [];
	var i = 0;
	for(var k in objarr){
		_newObjarr[k] = objarr[k];
		delete _newObjarr[k][key];
	}

	return _newObjarr;
}
function inflateArrToObj(arr,obj){
	var objKeys = Object.keys(obj);
	var newObj = {};
	for (var i in arr){
		newObj[objKeys[i]] = arr[i];
		cdebug('inflate '+objKeys[i]+' = '+arr[i]);
	}
	return newObj;
}
function objToArray(obj){
	if(Object.values)
		return Object.values(obj);
	else{
		var arr = [];
		for(var key in obj){
			if(typeof obj[key] !== 'function')
				arr.push(obj[key]);
		}
		return arr;
	}
}
function size(obj){
	var length = 0;
	if(!obj)
		return length;
	if(typeof obj == 'object'){
		return obj.length || Object.keys(obj).length;
	}else
		obj.size();
}
function inObject(obj,key,value){
	try{
		if(Array.isArray(value)){
			return value.indexOf(obj[key]) >= 0;
		}else{
			if(obj[key] && obj[key].toString() == value){
				return true;
			}
		}
		return false;
	}catch(e){
		console.error(e);
	}
}
function filterStrToArr(filter){ // filter str을 arr로 변환
	filter = filter.split(',');
	for(var i in filter){
		filter[i] = filter[i].split('+');
		for(var j in filter[i]){
			filter[i][j] = filter[i][j].trim();
		}
	}
	return filter;
}

function JSONFilter(arr,filter,options){
	var defaults = {
		fitting:false
	};
	options = $.extend(defaults,options);
	if(!filter) return arr;
	filter = Array.isArray(filter)? filter : filter.split(',');

	var newArray = new Array();

	if(options.fitting && options.key){ // 정확히 일치
		for(var k in arr){
			var correct = true;
			for(var i = 0; i < options.key.length; i++){
				if(!inObject(arr[k],options.key[i],filter)){
					correct = false;
					break;
				}
			}
			if(options.exclude){
				if(!correct){
					newArray.push(arr[k]);
				}
			}else{
				if(correct){
					newArray.push(arr[k]);
				}
			}
		}
		return newArray;
	}else{
		for(var key in arr){
			var isinOr = false; // 하나라도
			var string = '';
			if(options.key){
				for(var i = 0; i < options.key.length; i++){
					string += JSON.stringify(arr[key][options.key[i]])+' ';
				}
			}else{
				var string = JSON.stringify(objToArray(arr[key]));
			}
			if(!string){
				console.error(arr[key]);
				continue;
			}
			for(var i = 0 ; i < filter.length ; i++){
				var filterPlus = filter[i].split("+");
				var isinAnd = true; // + 니까 모두 포함
				for (var j = 0; j < filterPlus.length ; j++){
					try{
						var Cont = true;
						if(filterPlus[j].contains('~')){
							Cont = false;
							filterPlus[j] = filterPlus[j].replace('~','');
						}
						filterPlus[j] = filterPlus[j].trim();

						if(filterPlus[j].contains('=')){
							//정확히 일치
							try{
								var pair = filterPlus[j].split('=');
								var _key = pair[0];
								var _value = pair[1];
								if(!inObject(arr[key],_key,_value)) isinAnd = false;
							}catch(e){
								console.error('Cannot filtering fitting '+filterPlus[j]);
							}
						}else{
							// 포함
							if(Cont !== string.contains(filterPlus[j])) isinAnd = false;
						}
					}catch(e){
						if(string)
							console.error(string);
					}
				}
				if(isinAnd) break;
			}
			isinOr = isinAnd;
			if(isinOr)
				newArray.push(arr[key]);

		}
	}
	return newArray;
};

function cdebug(msg){
	if(!!window.show_debug)
		console.debug(msg);
}

(function(jQuery){
/* text() to arr */
	jQuery.fn.getTextArr = function (){
		return $(this).map(function(){
			return $.trim($(this).text());
        }).get();
	}
/* prevent backspace */
	$(document).on("keydown", function (e) {
		if (e.which === 8 && !$(e.target).is("input, textarea")) {
			e.preventDefault();
		}
	});
/* jquery extend */
	jQuery.fn.datechangehelper = function(options){
		var defaults = {
			helperObj:	$("<div class='absolute dc_helper fill-parent help' style='left:0;'></div>"),
			helperPrev:	$("<span role='date-prev' class='btn btn-default' style='z-index:100;padding:0;'>&lt;</span>"),
			helperNext:	$("<span role='date-next' class='btn btn-default' style='z-index:100;padding:0;'>&gt;</span>"),
			deli: '/'
		};
		options = $.extend(defaults,options);
		return this.each(function(idx,obj){
			var $target = $(obj).attr('data-dch-target') ? $($(obj).attr('data-dch-target')) : $(obj).find('input');

			if(!$target.length) return console.error('Need attribute [data-dch-target]');

			$(obj).addClass('relative help-handler');
			var $helperObj = options.helperObj.clone(true);
			var $helperPrev = options.helperPrev.clone(true);
			var $helperNext = options.helperNext.clone(true);

			// event
			$helperPrev.click(function(){
				changeDate($target,'-1일');
			});
			$helperNext.click(function(){
				changeDate($target,'1일');
			});
			if($target.length == 1){
				$helperPrev.addClass('pull-left').add($helperNext.addClass('pull-right')).addClass('fill-height');
				$helperObj.append($helperPrev).append($helperNext);
				$(obj).append($helperObj);

			}else{
				$helperPrev.add($helperNext).addClass('input-group-addon');
				$(obj).prepend($helperPrev).append($helperNext);
			}
			// css
			$helperPrev.add($helperNext)
				.css('width',$(obj).height());
				//.css('line-height',$(obj).height()+'px');
		});
		function changeDate($target,_disp){
			$target.val(function(idx,val){
				return val.toString().addDate(_disp,null,options.deli);
			});
			$target.change();
		}
	};
	jQuery.fn.filterDistinct = function(filter){
		filter = filter.toLowerCase();
		return this.filter(function(idx,obj){
			return 	$(obj.outerHTML.toLowerCase()).filter(filter).length > 0;
		});
	};
	jQuery.fn.outerHTML = function(){
		return this[0].outerHTML;
	};
	jQuery.fn.selectAll = function(){
		this.click(function(){
			if(getSelectionText().length == 0)
				$(this).select();
		});
	};
	jQuery.fn.autoDateForm = function(){
		return this.each(function(){
			$(this).bind('click',createForm)
			$(this).keypress(insertValue);
			$(this).keydown(autoForm);
			$(this).keyup(function(e){

				if(this.value == '0000/00/00' || !parseInt(this.value)){
					this.value = '';
				}
			});
		});
		function createForm(){
			if(this.value == ''){
				this.value = $.datepicker.formatDate('yy/mm/dd',new Date());
				$(this).setCursorPosition(2);
			}
		}
		function insertValue(e){
			$(this).trigger('click');
			this.cursorPosition = $(this).getCursorPosition();
			if(this.cursorPosition == 4 || this.cursorPosition == 7){
				this.cursorPosition++;
			}else if(this.cursorPosition > 9){
				this.cursorPosition = 9;
			}
			var split = this.value.split("");
			split.splice(this.cursorPosition,1);

			this.value = split.join("");
			$(this).setCursorPosition(this.cursorPosition);
		}
		function autoForm(e){

			if(e.keyCode == 8){
				// back space
				this.cursorPosition = $(this).getCursorPosition();

				if(this.cursorPosition ==5 || this.cursorPosition == 8){
					this.cursorPosition--;
				}
				if(this.cursorPosition > 0){
					var split = this.value.split("");
					split.splice(this.cursorPosition,0,'0');

					this.value = split.join("");
				}
				$(this).setCursorPosition(this.cursorPosition);

			}else if(e.keyCode == 46){
				// delete
				this.cursorPosition = $(this).getCursorPosition();

				if(this.cursorPosition == 4 || this.cursorPosition == 7){
					this.cursorPosition++;
				}
				if(this.cursorPosition > 9){
					this.cursorPosition = 9;
				}
				var split = this.value.split("");
				split.splice(this.cursorPosition,1,'00');
				this.value = split.join("");

				this.cursorPosition++;
				$(this).setCursorPosition(this.cursorPosition);
			}

		}
	};
	$.fn.getCursorPosition = function(){
		var el = $(this).get(0);
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;

            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
	};
	$.fn.setCursorPosition = function(pos) {
		this.each(function(index, elem) {
			if (elem.setSelectionRange) {
				elem.setSelectionRange(pos, pos);
			} else if (elem.createTextRange) {
				var range = elem.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		});
		return this;
	};
	jQuery.fn.cuttingText = function(length,postFix,after){
		cdebug('textCutting '+JSON.stringify(arguments));
		return this.each(function(i,obj){
			if($(obj).is('[data-cutting]')){
				length = $(obj).attr('data-cutting');
				//console.log('length = '+length);
			}
			$(obj).css('whiteSpace','nowrap');


			postFix = postFix || '';
			var $text = $(obj).text();
			var origin_text = $text;
			if($(obj).is('[data-origin-value]')){
				$text = $(obj).attr('data-origin-value');
				origin_text =$text;
			}else{
				$(obj).attr('data-origin-value',origin_text);
			}
			$text.length > length ? $text = $text.substr(0,length).trim()+postFix: "";
			$(obj).text($text);
			if(after){
				after(obj,origin_text);
			}
		});

	};
	jQuery.fn.fitHeight = function(options){
		return this.each(function(idx,obj){
			var defaults = {
				trigger: false,
				domobile: false
			};
			options = $.extend(defaults,options);
			var $this = $(obj);
			fitHeightInner();
			if(options.trigger){	return;}

			$(window).resize(fitHeightInner);
			function fitHeightInner(){
				if ( options.domobile ||($(window).width() > 768 && $this.offset())){
					cdebug($(window).height()+'-'+$this.offset().top);
					$this.height($(window).height()-$this.offset().top);
				}
			};
		});


	}
	jQuery.fn.tagName = function(){
		return this.prop("tagName");
	};
	jQuery.fn.getName = function(){
		return this.attr("name");
	};
	jQuery.fn.getInputType = function(){
		return this.attr("type");
	};
	/* money handler */
	jQuery.fn.moneyForm = function(){
		var val = this.value || $(this).text();
		this.blur(function(){
			if (this.value == ''){
				this.value = 0;
			}
			this.value = wonToMoney(this.value);
			this.value = addComma(this.value);
		});
		this.focus(function(){
			if (this.value == ''){
				this.value = 0;
			}
			this.value = wonToMoney(this.value);
		});
		return this.each(function(idx,obj){
			var objStyle= $(obj).tagName();
			if( objStyle == 'SPAN'){
				this.value = $(obj).text();
			}
			if (this.value == ''){
				this.value = 0;
			}
			if (isNaN(this.value)){
				return this.value;
			}
			this.value = wonToMoney(this.value);
			this.value = addComma(this.value);
			if( objStyle == 'SPAN' ){
				$(obj).text(this.value);
			}
			return this.value;

		})

	};

	jQuery.fn.rowMoney = function(){
		return this.each(function(){

			$(this).val(wonToMoney($(this).val()));
			return $(this).val();

		});
	};
	/* input transFormer!! */
	jQuery.fn.inputTransFormer = function(options){
		var defaults = {
			type:'text',
			maxLength:'',
			width:null,
			keyPress:null,
			returnRedirect:null,
			tabRedirect:'next',
			onChange:null,
			holding:'place',
			isTransForming : false
		};

		options = $.extend(defaults, options);
		return this.each(function(){
			if(!$(this).is('.hastransformer')){
				$(this).unbind('click',inputTransFormer);
				$(this).addClass('pointer hastransformer');
				$(this).click(inputTransFormer);
			}
		});
		function inputTransFormer(){

			if(options.isTransForming == true){
				return;
			}
			this.transforming = true;
			console.log('transform!');
			var origin = $(this);
			var _oriHeight = origin.height();
			var transformed = document.createElement('input');
			if($(this).is('[data-transform=textarea]')){
				var isTextarea = true;
				transformed = document.createElement('textarea');
				options.returnRedirect = null;
			}else
				var isTextarea = false;

			var target = origin.children().filter(':not(.input-label)');
			if($(this).is('[data-transform-target]')){
				target = $(this).find($(this).attr('data-transform-target'));
			}
			origin.children().hide();
			var originWidth = parseInt(origin.css('width'));

			// transformed setting
			//$(transformed).css('position','absolute');


			$(transformed).attr('type',options.type);
			$(transformed).addClass('transform-input');


			$(transformed).css('height',20);
			if(!isTextarea){
				$(transformed).css('marginTop',-2).css('marginLeft',-2);
				$(transformed).attr('maxLength',options.maxLength);
			}else{
				$(transformed).css('height',_oriHeight);
			}
			if(options.width){
				if(options.width == 'auto'){
					if(!originWidth)
						$(transformed).css('width',parseInt(target.css('width'))+4);
					else
						$(transformed).css('width',originWidth*0.85);

				}else
					$(transformed).css('width',options.width);
			}
			$(transformed).keydown(function(e){
				//console.log(e.keyCode);

				if (e.keyCode == 13){
					if (!!isTextarea) return true;
					returnForm(options.returnRedirect);
				}else if(e.keyCode == 9){
					returnForm(options.tabRedirect);
				}else if(e.keyCode == 27){
					returnForm();
				}
			});
			$(transformed).blur(returnForm);
			if(options.keyPress)
				$(transformed).keypress(eval(options.keyPress));
			origin.originValue = target.html().trim();

			//붙이기
			$(transformed).appendTo(this);
			origin.css('width',originWidth-1);
			//기본값
			if(options.holding == 'place'){
				$(transformed).attr('placeholder',origin.originValue);
			}else if(options.holding == 'select'){
				$(transformed).val(origin.originValue);
				$(transformed).select();
			}

			$(transformed).focus();
			$(transformed).click(function(e){
				e.preventDefault();
				e.stopPropagation();
			})

			function returnForm(redirect){
				options.isTransForming = false;
				origin.find('.inputtransformer-dummy').remove();
				origin.removeAttr('style');
				if ($(transformed).val() != ''){
					target.html($(transformed).val());
				}
				if(origin.originValue != target.html()){
					console.log(origin.originValue+'=>'+target.html());
					if(options.onChange){
						options.onChange(origin);
					}
				}
				$(transformed).remove();

				origin.children().show();
				if(redirect && redirect == options.returnRedirect || redirect == options.tabRedirect){
					//console.log(redirect);
					if(redirect == 'next'){
						return redirectNext();
					}else if(redirect == 'down'){
						return redirectDown();
					}else
						return redirect();
				}
			}
			function redirectNext(){
				event.preventDefault();
				var travH = origin.next();
				var travT = origin;
				for(; travH.length || travT.next('[class*=trans]').length ;){
					if(travH.is(travT.next('[class*=trans]'))){
						return travH.trigger('click');
					}
					travT = travH;
					travH = travH.next();
				}
				return origin.next().trigger('click');
			};
			function redirectDown(){
				event.preventDefault();
				var index = -1;
				var $parent = $('tr').has(origin);
				$parent.find('td').each(function(i,obj){
					if($(obj).is(origin)){
						return index = i;
					}
				});
				return $parent.next().find('td:eq('+index+')').click();
			};
		}
	};
	/* toggle table row */

	jQuery.fn.multipleToggle = function(options){
		var defaults = {
			activeTarget : 'tr',
			after:null,
			trigger:null
		}
		options = $.extend(defaults,options);
		var clicking = false;
		return this.each(function(){

			var $handler = $(this);
			$handler.css('cursor','pointer');
			//handler.click(toggle);
			$handler.mousedown(function(e){
				clicking = true;
				return toggle(e);
			});
			$handler.mouseenter(toggle);
			$('body').mouseup(out);
			$('body').mouseleave(out);

			function toggle(e){
				var $activeTarget = $(e.currentTarget).is(options.activeTarget)?$(e.currentTarget):$(options.activeTarget).has(e.currentTarget);
				if(clicking == true){
					$activeTarget.toggleClass('active');
					if(options.after && typeof options.after == 'function')
						options.after();
				}
				return false;
			}
			function out(){
				clicking=false;
			}
		});
	}


/**
*	@name							Elastic
*	@descripton						Elastic is jQuery plugin that grow and shrink your textareas automatically
*	@version						1.6.10
*	@requires						jQuery 1.2.6+
*
*	@author							Jan Jarfalk
*	@author-email					jan.jarfalk@unwrongest.com
*	@author-website					http://www.unwrongest.com
*
*	@licence						MIT License - http://www.opensource.org/licenses/mit-license.php
*/
	jQuery.fn.extend({
		elastic: function() {
			//	We will create a div clone of the textarea
			//	by copying these attributes from the textarea to the div.
			var mimics = [
				'paddingTop',
				'paddingRight',
				'paddingBottom',
				'paddingLeft',
				'fontSize',
				'lineHeight',
				'fontFamily',
				'width',
				'fontWeight',
				'border-top-width',
				'border-right-width',
				'border-bottom-width',
				'border-left-width',
				'borderTopStyle',
				'borderTopColor',
				'borderRightStyle',
				'borderRightColor',
				'borderBottomStyle',
				'borderBottomColor',
				'borderLeftStyle',
				'borderLeftColor'
				];

			return this.each( function() {
				if(this.isElastic) return;
				this.isElastic = true;
				// Elastic only works on textareas
				if ( this.type !== 'textarea' ) {
					return false;
				}

			var $textarea	= jQuery(this),
				$twin		= jQuery('<div />').css({'position': 'absolute','display':'none','word-wrap':'break-word'}),
				lineHeight	= parseInt($textarea.css('line-height'),10) || parseInt($textarea.css('font-size'),'10'),
				minheight	= parseInt($textarea.css('height'),10) || lineHeight*3,
				maxheight	= parseInt($textarea.css('max-height'),10) || Number.MAX_VALUE,
				goalheight	= 0;

				// Opera returns max-height of -1 if not set
				if (maxheight < 0) { maxheight = Number.MAX_VALUE; }

				// Append the twin to the DOM
				// We are going to meassure the height of this, not the textarea.
				$twin.appendTo($textarea.parent());

				// Copy the essential styles (mimics) from the textarea to the twin
				var i = mimics.length;
				while(i--){
					$twin.css(mimics[i].toString(),$textarea.css(mimics[i].toString()));
				}

				// Updates the width of the twin. (solution for textareas with widths in percent)
				function setTwinWidth(){
					curatedWidth = Math.floor(parseInt($textarea.width(),10));
					if($twin.width() !== curatedWidth){
						$twin.css({'width': curatedWidth + 'px'});

						// Update height of textarea
						update(true);
					}
				}

				// Sets a given height and overflow state on the textarea
				function setHeightAndOverflow(height, overflow){

					var curratedHeight = Math.floor(parseInt(height,10));
					if($textarea.height() !== curratedHeight){
						$textarea.css({'height': curratedHeight + 'px','overflow':overflow});

						// Fire the custom event resize
						$textarea.trigger('resize');

					}
				}

				// This function will update the height of the textarea if necessary
				function update(forced) {

					// Get curated content from the textarea.
					var textareaContent = $textarea.val().replace(/&/g,'&amp;').replace(/ {2}/g, '&nbsp;').replace(/<|>/g, '&gt;').replace(/\n/g, '<br />');

					// Compare curated content with curated twin.
					var twinContent = $twin.html().replace(/<br>/ig,'<br />');

					if(forced || textareaContent+'&nbsp;' !== twinContent){

						// Add an extra white space so new rows are added when you are at the end of a row.
						$twin.html(textareaContent+'&nbsp;');

						// Change textarea height if twin plus the height of one line differs more than 3 pixel from textarea height
						if(Math.abs($twin.height() + lineHeight - $textarea.height()) > 3){

							var goalheight = $twin.height()+lineHeight;
							if(goalheight >= maxheight) {
								setHeightAndOverflow(maxheight,'auto');
							} else if(goalheight <= minheight) {
								setHeightAndOverflow(minheight,'hidden');
							} else {
								setHeightAndOverflow(goalheight,'hidden');
							}

						}

					}

				}

				// Hide scrollbars
				$textarea.css({'overflow':'hidden'});

				// Update textarea size on keyup, change, cut and paste
				$textarea.bind('keyup change cut paste', function(){
					update();
				});

				// Update width of twin if browser or textarea is resized (solution for textareas with widths in percent)
				$(window).bind('resize', setTwinWidth);
				$textarea.bind('resize', setTwinWidth);
				$textarea.bind('update', update);

				// Compact textarea on blur
				$textarea.bind('blur',function(){
					if($twin.height() < maxheight){
						if($twin.height() > minheight) {
							$textarea.height($twin.height());
						} else {
							$textarea.height(minheight);
						}
					}
				});

				// And this line is to catch the browser paste event
				$textarea.bind('input paste',function(e){ setTimeout( update, 250); });

				// Run update once when elastic is initialized
				update();

			});

        }
    });
})(jQuery);
