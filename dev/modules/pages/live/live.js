var Live = function(){
	this.link = "http://bestline.bet/inplay/";
	this.html = '';
	this.date;
	this.date_fi;
}
Live.prototype = Object.create(Base.prototype);
Live.prototype.constructor = Live;

Live.prototype.timeTemplate = function(data){
	return 	`<div class="flex-container align-middle livePlay__time" data-tt="${data.data.TT}" data-tu="${data.data.TU}" data-tm="${data.data.TM}" data-ts="${data.data.TS}">
				<p class="font team-period">${data.half}</p>
				<p class="font team-time">(${data.timer})</p>
			</div>`;
}

Live.prototype.liveCategoryTemplate = function(name, it, id){
	return `<div class="liveCategory" data-it="${it}">
				<p class="icon sports-${id}"></p>
				<p class="text font">${name}</p>
			</div>`;
}

Live.prototype.forPeriodInfoTemplate = function(data, divNA){
	return  `<div class="livePlay__info">
				<p class="font ellipsis xmd">${data.NA}</p>
				<p class="font ellipsis sm">${divNA}</p>
				${this.timeTemplate(this.checkTime(data))}
			</div>`;
}

Live.prototype.forSetInfoTemplate = function(data, self, divNA){
	return  `<div class="livePlay__info">
				<p class="font ellipsis xmd">${data.NA}</p>
				<p class="font ellipsis sm">${divNA}</p>
				${this.s_SS_set(data.SS, 1).length} Set
			</div>`;
}

Live.prototype.forPeriodSSTemplate = function(data){
	return  `<div class="livePlay__count">
				<p class="font text-center team-score">${this.s_SS(data.SS)[0]}:${this.s_SS(data.SS)[1]}</p>
			</div>`;
}

Live.prototype.forSetSSTemplate = function(data){
	var html = '';
	html = `<div class="livePlay__count">
				<table>
					<tr>
						<td>
							${data.PI[0] == 1 ? `<div class="circle"></div>` : ``}
						</td>`;
			$.each(this.s_SS_set(data.SS, 1), function (index, item) {
				html += `<td>
							<p class="font primary">${item}</p>
						</td>`;
			});
				html += `<td>
							<p class="font">${this.s_SS(data.XP)[0]}</p>
						</td>
					</tr>
					<tr>
						<td>
							${data.PI[2] == 1 ? `<div class="circle"></div>` : ``}
						</td>`;
			$.each(this.s_SS_set(data.SS, 2), function (index, item) {
				html += `<td>
							<p class="font primary">${item}</p>
						</td>`;
			});
				html += `<td>
							<p class="font">${this.s_SS(data.XP)[1]}</p>
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
							html += self.forPeriodInfoTemplate(data, divNA);
							html += self.forPeriodSSTemplate(data);
						break;
						case "Tennis":
							html += self.forSetInfoTemplate(data, divNA);
							html += self.forSetSSTemplate(data);
						break;
						case "Table Tennis":
							html += self.forSetInfoTemplate(data, divNA);
							html += self.forSetSSTemplate(data);
						break;
						case "Badminton":
							html += self.forSetInfoTemplate(data, divNA);
							html += self.forSetSSTemplate(data);
						break;
						case "Volleyball":
							html += self.forSetInfoTemplate(data, divNA);
							html += self.forSetSSTemplate(data);
						break;
						case "Beach Volleyball":
							html += self.forSetInfoTemplate(data, divNA);
							html += self.forSetSSTemplate(data);
						break;
						default:
							html += self.forPeriodInfoTemplate(data, divNA);
							html += self.forPeriodSSTemplate(data);
					}				
		html +=`</div>
				<div class="liveDropdown">
					<div class="flex-container flex-wrap">
						<i class="fa fa-spinner fa-pulse loading"></i>
					</div>
				</div>`;
	return html;
}

Live.prototype.loadDataFi = function(data, wrap){
	var self = this;
	this.httpGet("http://bestline.bet/event/?FI="+data)
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

Live.prototype.loadData = function(){
	var self = this;
	this.httpGet(this.link)
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
		self.html += '<div class="wrapper__item" style="margin-bottom: 10px;">'
		self.html += self.liveCategoryTemplate(item.NA, item.IT, item.ID)
		var catIt = item.IT,
			play = item.NA
		$.each(item.CT, function (index, item) {
			var d_NA = item.NA
			$.each(item.EV, function(index, item){
				if (self.checkValue(item, 'NA')) {
					self.html += self.resultsLiveTemplate(item, play, catIt, d_NA)
				}
			});
		});
		self.html += '</div>';
	});
	$('#live-forTable').html(this.html);
	this.startTimer();
};

live = new Live();
live.loadData();


$(document).on('click',".live-content .livePlay",function(){
	var wrap = $(this).next().find('.flex-wrap'),
		dropdown = $(this).next();
	if (dropdown.hasClass('liveDropdown--active')) {
		dropdown.removeClass('liveDropdown--active');
	}
	else{
		$('#live-forTable').find('.liveDropdown--active').removeClass('liveDropdown--active');
		dropdown.addClass('liveDropdown--active');
	}
	wrap.html();
	live.loadDataFi($(this).attr("data-fi"), wrap);
});