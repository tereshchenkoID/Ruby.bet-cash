var Live = function(){
	this.link = "http://bestline.bet/inplay/";
	this.html = '';
	this.date;
	this.date_fi;
}

Live.prototype.loadDataFi = function(data, wrap){
	var self = this;
	base.httpGet("http://bestline.bet/event/?FI="+data)
		.then(response => {
			this.date_fi = JSON.parse(response);
			self.drawDataFi(wrap)
		})
		.then(error => {});
}

Live.prototype.drawDataFi = function(wrap){
	var html = '', SU;
	$.each(this.date_fi.RESULT[0].MA, function (index, item) {
		SU = (item.SU == 1) ? 'disabled' : '';
		html += `<div class="liveDropdown__table">
					<div class="row">`;
				$.each(item.PA, function (index, item) {
				html +=`<div class="cell">
							<p class="font">${item.N2}</p>
						</div>`;
				});
			html += `</div>
					<div class="row ${SU}">`;
				$.each(item.PA, function (index, item) {
					var SU_b = (item.SU == 1) ? 'disabled' : '';
				html +=`<div class="cell count ${SU_b}">
							<p class="font">${item.OD.D}</p>
						</div>`;
				});
		html +=	`	</div>
				</div>`;
	});
	$(wrap).html(html);
}

Live.prototype.liveCategoryTemplate = function(name, it, id){
	return `<div class="liveCategory" data-it="${it}">
				<p class="icon sports-${id}"></p>
				<p class="text font">${name}</p>
			</div>`;
}

Live.prototype.timeTemplate = function(half, timer, data){
	return 	`<div class="flex-container align-middle livePlay__time" data-tt="${data.TT}" data-tu="${data.TU}" data-tm="${data.TM}" data-ts="${data.TS}">
				<p class="font team-period">${half}</p>
				<p class="font team-time">(${timer})</p>
			</div>`;
}

Live.prototype.forPeriodInfoTemplate = function(data, self, divNA){
	return  `<div class="livePlay__info">
				<p class="font ellipsis xmd">${data.NA}</p>
				<p class="font ellipsis sm">${divNA}</p>
				${self.checkTime(data, self)}
			</div>`;
}

Live.prototype.forSetInfoTemplate = function(data, self, divNA){
	return  `<div class="livePlay__info">
				<p class="font ellipsis xmd">${data.NA}</p>
				<p class="font ellipsis sm">${divNA}</p>
				${base.s_SS_set(data.SS, 1).length} Set
			</div>`;
}

Live.prototype.forPeriodSSTemplate = function(data, self){
	return  `<div class="livePlay__count">
				<p class="font text-center team-score">${base.s_SS(data.SS)[0]}:${base.s_SS(data.SS)[1]}</p>
			</div>`;
}

Live.prototype.forSetSSTemplate = function(data, self){
	var html = '';
	html = `<div class="livePlay__count">
				<table>
					<tr>
						<td>
							${data.PI[0] == 1 ? `<div class="circle"></div>` : ``}
						</td>`;
			$.each(base.s_SS_set(data.SS, 1), function (index, item) {
				html += `<td>
							<p class="font primary">${item}</p>
						</td>`;
			});
				html += `<td>
							<p class="font">${base.s_SS(data.XP)[0]}</p>
						</td>
					</tr>
					<tr>
						<td>
							${data.PI[2] == 1 ? `<div class="circle"></div>` : ``}
						</td>`;
			$.each(base.s_SS_set(data.SS, 2), function (index, item) {
				html += `<td>
							<p class="font primary">${item}</p>
						</td>`;
			});
				html += `<td>
							<p class="font">${base.s_SS(data.XP)[1]}</p>
						</td>
					</tr>
				</table>
			</div>`;
	return html;
}

Live.prototype.resultsLiveTemplate = function(data, play, catIt, divNA){
	var self = this;
	var html = `<div class="flex-container align-middle livePlay" data-catit="${catIt}" data-fi="${data.FI}" data-it="${data.IT}">
					<div class="livePlay__id">
						<p class="font xmd bold">931</p>
						<p class="font">1021</p>
					</div>
					<div class="livePlay__icon">
						<img src="./img/icon-country/Sweden.ico" alt="Sweden">
					</div>`;
					switch (play) {
						case "Soccer":
							html += self.forPeriodInfoTemplate(data, self, divNA);
							html += self.forPeriodSSTemplate(data, self);
						break;
						case "Tennis":
							html += self.forSetInfoTemplate(data, self, divNA);
							html += self.forSetSSTemplate(data, self);
						break;
						case "Table Tennis":
							html += self.forSetInfoTemplate(data, self, divNA);
							html += self.forSetSSTemplate(data, self);
						break;
						case "Badminton":
							html += self.forSetInfoTemplate(data, self, divNA);
							html += self.forSetSSTemplate(data, self);
						break;
						case "Volleyball":
							html += self.forSetInfoTemplate(data, self, divNA);
							html += self.forSetSSTemplate(data, self);
						break;
						case "Beach Volleyball":
							html += self.forSetInfoTemplate(data, self, divNA);
							html += self.forSetSSTemplate(data, self);
						break;
						default:
							html += self.forPeriodInfoTemplate(data, self);
							html += self.forPeriodSSTemplate(data, self);
					}				
		html +=`</div>
				<div class="liveDropdown">
					<div class="flex-container flex-wrap">
						<i class="fa fa-spinner fa-pulse loading"></i>
					</div>
				</div>`;
	return html;
}

Live.prototype.checkTime = function(data, self){
	var timer = '';
	var half  = '';
	if (data.DC == 1) {
		if (data.TT == 1 || data.TM > 0){
			timer = self.timer (data.TU, data.TM, data.TS);
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
	return self.timeTemplate(half, timer, data);
}

Live.prototype.timer = function(etu, etm, ets) {
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

Live.prototype.timerTT = function(etm, ets) {
	if (etm<10) etm = '0'+etm; 
	if (ets<10) ets = '0'+ets; 
	timer = etm+':'+ets;
	return timer;
}

Live.prototype.startTimer = function(){
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

Live.prototype.loadData = function(){
	var self = this;
	base.httpGet(this.link)
		.then(response => {
			this.date = JSON.parse(response);
			self.drawData(self)
		})
		.then(error => {});
}

Live.prototype.drawData = function(self){
	this.html = '';
	$('#live-forTable').html('');
	$.each(this.date.DATA, function (index, item) {
		self.html += '<div class="wrapper__item">'
		self.html += self.liveCategoryTemplate(item.NA, item.IT, item.ID)
		var catIt = item.IT,
			play = item.NA
		$.each(item.CT, function (index, item) {
			var d_NA = item.NA
			$.each(item.EV, function(index, item){
				if (base.checkValue(item, 'NA')) {
					self.html += self.resultsLiveTemplate(item, play, catIt, d_NA)
					//self.html += self.liveDropdownTemplate();
				}
			});
		});
		self.html += '</div>';
	});
	$('#live-forTable').html(this.html);
	self.startTimer();
};

live = new Live();
live.loadData();


$(document).on('click',".livePlay",function(){
	$(this).next().show();
	var wrap = $(this).next().find('.flex-wrap');
	$(wrap).html();
	live.loadDataFi($(this).attr("data-fi"), wrap);
});