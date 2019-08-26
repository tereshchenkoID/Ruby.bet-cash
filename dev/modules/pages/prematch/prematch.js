var Prematch = function(){
	this.link = "http://bestline.bet/prematch/?sport_id=1";
	this.html = '';
	this.date;
	this.date_fi;
}
Prematch.prototype = Object.create(Base.prototype);
Prematch.prototype.constructor = Prematch;


Prematch.prototype.liveCategoryTemplate = function(name, id){
	return `<div class="liveCategory">
				<p class="icon sports-${id}"></p>
				<p class="text font">${name}</p>
			</div>`;
}

Prematch.prototype.resultsLiveTemplate = function(data, divNA){
	var self = this;
	var html = `<div class="flex-container align-middle livePlay" data-fi="${data.FI}" data-it="${data.IT}">
					<div class="livePlay__id">
						<p class="font xmd bold">931</p>
						<p class="font">1021</p>
					</div>
					<div class="livePlay__icon">
						<img src="./img/icon-country/Sweden.ico" alt="Sweden">
					</div>
					<div class="livePlay__info">
						<p class="font ellipsis xmd">${data.NA}</p>
						<p class="font ellipsis sm">${divNA}</p>
					</div>
					<div class="livePlay__info">
						<p class="font lg primary text-right">${this.g_TU(data.TU)}</p>
					</div>
				</div>
				<div class="liveDropdown">
					<div class="flex-container flex-wrap">
						<i class="fa fa-spinner fa-pulse loading"></i>
					</div>
				</div>`;
	return html;
}

Prematch.prototype.loadDataFi = function(data, wrap){
	var self = this;
	this.httpGet("http://bestline.bet/prematch_ev/?FI="+data)
		.then(response => {
			this.date_fi = JSON.parse(response);
			self.drawDataFi(wrap)
		})
		.then(error => {});
}

Prematch.prototype.drawDataFi = function(wrap){
	var html = '', SU;
	$.each(this.date_fi.RESULT.EV[0].MA, function (index, item) {
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

Prematch.prototype.loadData = function(){
	var self = this;
	this.httpGet(this.link)
		.then(response => {
			this.date = JSON.parse(response);
			self.drawData(self)
		})
		.then(error => {});
}

Prematch.prototype.drawData = function(self){
	this.html = '';
	$('#prematch-forTable').html('');
	self.html += self.liveCategoryTemplate(this.date.RESULT.SN, this.date.RESULT.SI)
	$.each(this.date.RESULT.CT, function (index, item) {
		var d_NA = item.NA
		$.each(item.EV, function (index, item) {
			self.html += self.resultsLiveTemplate(item, d_NA)
		});
	});
	$('#prematch-forTable').html(this.html);
};

prematch = new Prematch();
prematch.loadData();


$(document).on('click',".prematch-content .livePlay",function(){
	var wrap = $(this).next().find('.flex-wrap'),
		dropdown = $(this).next();
	if (dropdown.hasClass('liveDropdown--active')) {
		dropdown.removeClass('liveDropdown--active');
	}
	else{
		$('#prematch-forTable').find('.liveDropdown--active').removeClass('liveDropdown--active');
		dropdown.addClass('liveDropdown--active');
	}
	wrap.html();
	prematch.loadDataFi($(this).attr("data-fi"), wrap);
});