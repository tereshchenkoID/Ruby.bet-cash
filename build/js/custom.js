$(document).ready(function(){

});

$(window).on('hashchange', function(e) {
  	var hash = window.location.hash.slice(1);
    load.loadPages();
});

var Load = function(){
	this.currentUrl = '';
	this.config = {
		"header": {	
			"wrap": "header",
			"css": false,
			"lang": false
		},
		"pages":{
			"live":{
				"classification": { 
					"wrap": "#live-forMainClassification",
					"css": false,
					"lang": false
				},
				"search": { 
					"wrap": "#live-forMainSearch",
					"css": false,
					"lang": false
				}
			},
			"prematch":{
				"search": { 
					"wrap": "#prematch-forMainSearch",
					"css": false,
					"lang": false
				}
			},
			"printPrematch":{}
		}
	};
}


Load.prototype.checkActiveMenuItem = function(self){
	$(".menu a").each(function(index) {
	  	if ($(this).attr("href") == `/#/${self.getCurrentUrl()}/`)
	  		$(this).addClass('active');
	  	else
	  		$(this).removeClass('active');
	});
}

Load.prototype.getCurrentUrl = function(){
	var self = this;
	var hash = window.location.hash.slice(1);
	var regex = new RegExp('/', 'g');	
	if (!hash) {
		window.location.hash = '/live/';
		return 'sports';
	}
	else if(!self.checkUrl(hash.replace(regex, ""))){
		window.location.hash = '/live/';
		return 'sports';
	}
	return hash.replace(regex, "");
}

Load.prototype.checkUrl = function(value) {
	if (value in this.config.pages) {
		return true;
	}
	else{
		return false;
	}
};

Load.prototype.loadHtml = function(path, wrapper){
	$(wrapper).load(path);
}

Load.prototype.loadCss = function(path){
	$.get(path, function(content){
		$('<style type="text/css"></style>')
			.html(content)
			.appendTo("head");
	});
}

Load.prototype.loadScripts = function(path){
	$.getScript(path, function() {});
}

Load.prototype.loadParts = function(data) {
	var self = this;
	if (data in this.config){
		var path = `../modules/${this.config[data].wrap}/${this.config[data].wrap}`,
			css = `${path}.css`,
			js = `${path}.js`;

		self.loadScripts(js);
		if (this.config[data].css)
			self.loadCss(css);
	}
	else{
		console.log(`Error, ${data} not found`)
	}
};


Load.prototype.loadModules = function(data, parts){
	var self = this;
	$.each(data, function(index, item){
		var path = `../modules/${parts}/${index}/${index}`,
			html = `${path}.html`,
			css = `${path}.css`,
			js = `${path}.js`;

		self.loadHtml(html, item.wrap)
		self.loadScripts(js)
		if (item.css)
			self.loadCss(css);
	});
}

Load.prototype.loadPages = function() {
	$('.loader').show();
	var self = this;
	var path = self.getCurrentUrl();
	$.ajax({
		type: "GET",
		url: `../modules/pages/${path}/${path}.html`,
		data: "navigate=ajax",
		success: function(data){
			$(".main").html(data);
			self.currentUrl = self.getCurrentUrl();
			self.loadModules(self.config['pages'][self.currentUrl], "main");
			self.loadScripts(`../modules/pages/${path}/${path}.js`);
			self.checkActiveMenuItem(self);
			$('.loader').hide();
		},
		error: function(){
            console.log("Error")
        }
	});
}

var load = new Load();
load.loadPages();




var Base = function (){}

Base.prototype.s_NA= function(data){
	var team = data.split('vs')
	return team;
}

Base.prototype.s_SS = function(data, separate){
	if (data) {
		return data.split('-');
	}
	else{
		return [0, 0];
	}
}

Base.prototype.s_SS_set  = function(data, count){
	var scoreFirst = [];
	var scoreSecond = [];
	var res = data.split(',');
	if (res.length > 0) {
		for (var i = 0; i < res.length; i++) {
			var a = res[i].split('-');
			scoreFirst.push(a[0]);
			scoreSecond.push(a[1]);
		}
	}
	if (count == 1)
		return scoreFirst;
	else
		return scoreSecond;
}


Base.prototype.getCookie = function(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


Base.prototype.checkTime = function(data){
	var timer = '',
		half  = '',
		self = this;
	if (data.DC == 1) {
		if (data.TT == 1 || data.TM > 0){
			timer = self.timer(data.TU, data.TM, data.TS);
		}
		else
			timer = '00:00';

		if (data.TM >= 45)
		  half = '2nd Half';
		else
		  half = '1st Half';

		if (data.TM == 45 && data.TT == 0) {
		  half = 'Half Time';
		  timer = '45:00'
		}

		if (data.TT == 0 && data.TU == '') {
			half = '1st Half';
			timer = self.timerTT(data.TU, data.TM, data.TS);
		}
	}
	return {half: half, timer: timer, data: data};
}

Base.prototype.timer = function(etu, etm, ets) {
	etu = etu.toString();
	etm = etm.toString();
	ets = ets.toString();
	years = etu.substring(0,4); 
	month = etu.substring(4,6); 
	day = etu.substring(6,8);
	hours = etu.substring (8,10);
	minute = etu.substring(10,12);
	second = etu.substring(12,14);
	date = years+'-'+month+'-'+day+' '+hours+':'+minute+':'+second;
	var ts = new Date(date).getTime()/1000;
	var tn = new Date().getTime()/1000;
	dt = Math.floor(tn - ts + etm*60 + ets - 120*60);
	min = Math.floor(dt / 60);
	sec = dt - min * 60;
	if (min<10) min = '0'+min; 
	if (sec<10) sec = '0'+sec; 
	timer = min+':'+sec;
	return timer;
}

Base.prototype.timerTT = function(etm, ets) {
	if (etm<10) etm = '0'+etm; 
	if (ets<10) ets = '0'+ets; 
	timer = etm+':'+ets;
	return timer;
}

Base.prototype.startTimer = function(){
	var self = this;
	$('[data-tt=0]').each(function(i, elem){
		var tm = $(this).data("tm");
		var ts = $(this).data("ts");
		var timer = self.timerTT(tm, ts);
		$(this).find('.team-time').text(timer);
	});

	setInterval(function(){
		$('[data-tt=1]').each(function(i, elem){
			var tu = $(this).data("tu");
			var tm = $(this).data("tm");
			var ts = $(this).data("ts");
			var timer = self.timer(tu, tm, ts);
			$(this).find('.team-time').text(timer);
		});
	}, 500);
};


Base.prototype.checkValue = function(obj, value){
	return obj.hasOwnProperty(value)
}

Base.prototype.g_TU = function(etu) {
	etu = etu.toString();
	years = etu.substring(0,4); 
	month = etu.substring(4,6); 
	day = etu.substring(6,8);
	hours = etu.substring (8,10);
	minute = etu.substring(10,12);
	second = etu.substring(12,14);
	date = years+'-'+month+'-'+day+' '+hours+':'+minute;
	return date;
}

Base.prototype.httpGet = function(url){
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onload = function() {
			if (this.status == 200) {
				resolve(this.response);
			} else {
				var error = new Error(this.statusText);
				error.code = this.status;
				reject(error);
			}
		};
		xhr.onerror = function() {
			reject(new Error("Network Error"));
		};
	  	xhr.send();
	});
}

var base = new Base();