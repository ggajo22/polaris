/* prototype */
String.prototype.nl2br = function(){  
    return this.replace(/\n/g, "<br />");  
}
String.prototype.removeNonDigit = function(){
	var str = '';
	for (var i = 0;i < this.length ; i++ ){
		if(this[i] >= 0 && this[i] <= 9)
			str += this[i];
	}
	return str;
};
String.prototype.replaceAll = function(target,rep){
	var str = this;
	var num = Counting(str,target);
	for(var i = 0 ; i < num ; i++){
		str = str.replace(target,rep);
	}
	return str;
};
String.prototype.toHTML = function(){
	return this.replaceAll('\\n','<br>').replaceAll('\\','');
}

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
String.prototype.divstr = function(deli,idx,reverse){
	deli = deli || "/";
	idx = idx || 2;
	
	if(!Array.isArray(idx)){
		temp = [];
		for(var i=0; i < (this.length/idx)-1; i++){
			temp[i] = (i+1)*idx;
		}
		idx = temp;
	}
	if(!idx.length)
		idx = [0];
	var str = "";
	if(!reverse){
		var start = 0;
		for(var i = 0; i < idx.length ; i++){
			str += this.substring(start,idx[i])+deli;
			start = idx[i];
		}
		str += this.substring(start);
	}else{
		var start = this.length;
		for(var i = 0; i < idx.length ; i++){
			str = deli+this.substring(this.length-idx[i],start)+str;
			start = this.length-idx[i];
		}
		str = this.substring(0,start)+str;
		
	}

	return str;
};
Number.prototype.divstr = function(deli,idx){
	return this.toString().divstr(deli,idx);
}

String.prototype.subtractTime = function(target){
	if(!target)
		return this;
	if(this.length < 6 || target.length < 6)
		return console.error(this+"-"+target+"> cant subtract, target length must be over 5");
	var sec = parseInt(this.substring(this.length-2)) - parseInt(target.substring(target.length-2));
	var min = parseInt(this.substring(this.length-4,this.length-2)) - parseInt(target.substring(target.length-4,target.length-2));
	var hour = parseInt(this.substring(0,this.length-4)) - parseInt(target.substring(0,target.length-4));
	if(sec < 0){sec += 60;min-=1}
	if(min < 0){min += 60;hour-=1}
	var hLen = hour.length > 2 ? hour.length : (hour < 0 ? hour.length+1 : 2);
	//console.log(hour.zf(hLen)+":"+min.zf(2)+":"+sec.zf(2));
	return hour.zf(hLen)+min.zf(2)+sec.zf(2);
};
String.prototype.addTime = function(target){

	if(this.length < 6 || target.length < 6)
		return console.error(this+"+"+target+">cant add, target length must be over 5");
	var sec = parseInt(this.substring(this.length-2)) + parseInt(target.substring(target.length-2));
	var min = parseInt(this.substring(this.length-4,this.length-2)) + parseInt(target.substring(target.length-4,target.length-2));
	var hour = parseInt(this.substring(0,this.length-4)) + parseInt(target.substring(0,target.length-4));
	if(sec < 0){sec += 60;min-=1}
	else if(sec >= 60){sec -= 60;min+=1}
	if(min < 0){min += 60;hour-=1}
	else if(min >= 60){min -= 60;hour+=1}
	//console.log(hour.zf(hLen)+":"+min.zf(2)+":"+sec.zf(2));
	if(hour.size() < 2){
		hour = hour.zf(2);
	}
	return hour+min.zf(2)+sec.zf(2);
};
Number.prototype.addTime = function(target){
	return this.toString().addTime(target);
}
Number.prototype.posDigit = function(from,to){
	to = to || 0;
	return Math.floor((this%Math.pow(10,from)) / Math.pow(10,to));
};
String.prototype.size = function(){	return this.length};
Number.prototype.size = function(){	return this.toString().length};

/* Dates */
String.prototype.addDate = function($val,include,deli){
	deli = deli || '/';
	include = include || 0;
	var SECOND = 1000;
	var MINUTE = 60 * SECOND;
	var HOUR = 60*MINUTE;
	var DAY = 24*HOUR;
	var WEEK = 7*DAY;

	var _added = this;
	_added = _added.replaceAll('_','/');
	if(!_added.contains('/'))
		_added = _added.divstr('/',[4,6]);
	if($val.contains('주')){
		$val = $val.replaceAll('주','').trim();
		_added = new Date(_added).getTime() + $val*WEEK - include;
	}else if(Contains($val,'일')){
		$val = $val.replaceAll('일','').trim();
		_added = new Date(_added).getTime() + $val*DAY - include;
	}else if($val){
		_added = new Date(_added).getTime() + $val*SECOND;
	}
	return new Date(_added).dateFormat('yyyy'+deli+'MM'+deli+'dd');
};
Date.prototype.dateFormat = function(f){
	if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.convertDay = function(type){
	type = type || 'kr';
	var dayNameKr = ["일","월","화","수","목","금","토"];
	var dayNameEng = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var newDay = this;
	var _dayName;
	switch(type){
	case 'en':
		_dayName = dayNameEng;
		break;
	default:
		_dayName = dayNameKr;
	}
	
	for(var i = 0; i < 7 ; i++){
		newDay = newDay.replaceAll(i.toString(),_dayName[i]);
	}
	return newDay;
}
Number.prototype.convertDay = function(type){
	return this.toString().convertDay(type);	
}
String.prototype.getDay = function(){
	var date = this.replaceAll('/','').replaceAll('_','');
	if(date.size() != 8)
		return console.error('Invalide Date');
	date = date.divstr('/',[2,4],true);
	date = new Date(date);
	return date.getDay();
};
function getToday(){
	return new Date().dateFormat('yyyyMMdd');
}
function getWeekArr(date){
	return getEachDate(getWeek(date));
};
function getWeek(date){
	if(typeof date == 'string' && date.contains('~'))
		return date;
	cdebug("getWeeks");
	cdebug("type of date "+ typeof date);
	var originDate = typeof date == "object" ? date : new Date(date);

	var weekDay = (originDate.getDay()+6)%7;
	var startDate = new Date(originDate.setDate(originDate.getDate()-weekDay));
	var start = jQuery.datepicker.formatDate('yy/mm/dd',startDate);
	var end = jQuery.datepicker.formatDate('yy/mm/dd',new Date(startDate.setDate(startDate.getDate()+6)));
	var weekName = start + '~' + end;
	
	return weekName;
};
function getEachDate(dateDomain,dayDomain,addDiv){
	
	try{
		var _array = new Array();
		var s_e_date = dateDomain.split('~');
		var s_date = s_e_date[0].replaceAll('/','');
		var e_date = s_e_date[1].replaceAll('/','');
		s_date = parseInt(s_date);
		e_date = parseInt(e_date);
		for(; s_date <= e_date; s_date++){
			if(s_date.posDigit(4,2) <= 12 && s_date.posDigit(4,2) > 0
				&& s_date.posDigit(2) <= 31 && s_date.posDigit(2) > 0){
				if( s_date.posDigit(2) >= 29 && 
					new Date(s_date.posDigit(8,4)+'/'+s_date.posDigit(4,2)+'/'+s_date.posDigit(2)).dateFormat('yyyyMMdd') 
					!= s_date){
					// 29일이상은 유효성 검사
					continue;
				}
				if(dayDomain && !dayDomain.contains(s_date.toString().getDay().toString())){
					continue;
				}
				var _finalDate = s_date.toString();
				if(addDiv === true)
					_finalDate = _finalDate.divstr('/',[4,6]);

				_array.push(_finalDate);
			}
		}
		cdebug('getEachDate returns:'+_array.length);
		return _array;
	}catch(e){
		console.error(e);
		console.error("getEachDate : cannot procedure '"+dateDomain+"'");
		return new Array(dateDomain);
	}
};


/* money form */
function wonToMoney(value){
	if (!value || value == ''){	return 0;}
	value = removeComma(value);
	
	var splitPoint = [];
	for (var i = 0; i < value.length ; i++ ){
		if (isUnit(value[i])){
			splitPoint.push(i);
		}
	}
	if (splitPoint.length > 0){
		newValue = 0;

		var j = 0;
		for (var i = 0;i < splitPoint.length ; i++ ){
			var temp = '';
			for (; j < splitPoint[i];j++ ){
				temp = temp+''+wonToNumber(value[j]);
			}
			console.log('wonToMoney '+i+'>'+temp+'>'+value[j]+'splitPoint[i]'+splitPoint[i]+',j'+j);
			if(splitPoint[i] == 0){ // 처음에 바로 유닛이 나와버리는 경우
				temp = '1';
			}
			if (temp.trim() != ''){
				temp = parseInt(temp);
				temp *= wonToNumber(value[j]);
				newValue += parseInt(temp);
			}else{
				if(wonToNumber(value[j]) > newValue ){
					newValue *= wonToNumber(value[j]);
				}else
					newValue += wonToNumber(value[j]);
			}
			j++;
		}
		if(j+1 < value.length){
			newValue += parseInt(value.substring(j+1));
		}
	}else{
		newValue = value;
	}
	/*var newValue = 0;
	if (splitPoint.length > 0){ // 유닛이 있을시
		var stack = [];
		var temp = '';
		for (var i = 0; i < value.length ; i++ ){
			if(splitPoint.indexOf(i) >= 0){
				if(temp !== '')
					stack.push(temp);
				stack.push(wonToNumber(value[i]));
				temp = '';
			}else{
				temp += ''+wonToNumber(value[i]);
			}
		}
		console.log(stack);
		for (;stack.length > 0 ;){
			var temp = stack.pop();
			var currPos = newValue.toString().length;
			var tempPos = temp.toString().length;
			if(newValue > 0){
				if(currPos < tempPos){
					newValue *= temp;
				}else{
					newValue = temp*newValue;
				}
			}else{
				newValue += temp;
			}
		}
		
	}else{
		newValue = value;
	}*/
	
	return newValue;
}
function isUnit(u){
	return u == '조' || u == '억' ||u == '만' ||u == '천' ||u == '백' ||u == '십';
}
function isNumber(n){
	return n == 0 || parseInt(n);
}

function wonToNumber(won){
	if (isNumber(won)){
		return won;
	}
	switch(won){
	case '조':		return 1000000;
	case '억':		return 100000;
	case '만':		return 10000;
	case '천':		return 1000;
	case '백':		return 100;
	case '십':		return 10;
	case '구':		return 9;
	case '팔':		return 8;
	case '칠':		return 7;
	case '육':		return 6;
	case '오':		return 5;
	case '사':		return 4;
	case '삼':		return 3;
	case '이':		return 2;
	default:		return 1;
	}
}
function removeComma(value){
	if (!value || value == ''){	return 0;}
	var newValue = '';
	value = value.toString();
	for (var i = value.length-1; i >= 0 ; i-- ){
		if (value[i] != ','){
			newValue = value[i]+newValue;
		}
		
	}
	return newValue;
}
function addComma(value){
	if (!value || value == ''){	return 0;}
	value = removeComma(value);
	

	var newValue = '';
	var count = 0;
	for (var i = value.length-1; i >= 0 ; i-- ){

		if (count >= 3){
			count = 0;
			if(value[i] != '-')
				newValue = ','+newValue;
		}
		newValue = value[i]+newValue;
		count++;
		//console.log(i+' > '+newValue+' > '+count);
		
	}
	return newValue;
}

/* input */
jQuery.fn.flushInput = function() {
	return this.focus(function() {
		this.defaultValue = this.value;
		this.value = '';
		
	}).blur(function() {
		if( !this.value.length ) {
			this.value = this.defaultValue;
		}
	});
};

function replaceInput(options){
	
}

function rejectSpecialChar(contains){
	contains = (typeof contains == 'object')?this.getAttribute("data-rc-contain"):contains;

	var allow = true;
	var c = event.charCode;
	if (contains)
		for (var i = 0; i < contains.length ; i++ ){
			if (c == contains.charCodeAt(i)){
				return true;
			}
		}
	
    if (	(c >=32 && c <=47)
		|| (c >= 58 && c <= 64)	
		|| (c >=91 && c <=96)
		|| (c >=123 && c <=126)
		){
		allow = false;
	}

	if (!allow){
		event.preventDefault();
	}
	return allow;
}
function allowOnlyNum(c){
	var c = event.charCode;
	if (!(c >=48 && c <=57)){
		event.preventDefault();
		return false;
	}
}
String.prototype.contains = function(strWord,boolGap){
	var cont = false;
	if(typeof strWord == 'object'){
		for(var i= 0; i < strWord.length; i++){
			cont = Contains(this,strWord[i],boolGap);
			if(cont) return cont;
		}
		return cont;
	}else
		return Contains(this,strWord,boolGap);
};
function Contains(strTarget,strWord, boolGap){
	if(strTarget == null){
		console.error('Contains get target null.. return false');
		return false;
	}
	
    strTarget = strTarget.toUpperCase();
	try{
		strWord = strWord.toUpperCase();
	}catch(e){ console.error(e);console.error(strWord);}
    if (strTarget == strWord) {return true;}
    if (boolGap){
        strTarget = strTarget.replace(' ','');
        strWord = strWord.replace(' ','');
    }
    return strTarget.indexOf(strWord) >= 0;
    
};
function Counting(strTarget,strWord){
	var count = 0;
	strTarget = strTarget.toUpperCase();
    strWord = strWord.toUpperCase();
	if (strWord.length > strTarget.length){ return false;}
	for(var i = 0 ; i <= strTarget.length - strWord.length; i++){
        if (strTarget.substring(i, i+ strWord.length) == strWord){count++;}
    }
	return count;
};