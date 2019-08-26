var Classification = function(){
	this.link = "http://bestline.bet/inplay/";
	this.date;
	this.html = '';
}

Classification.prototype = Object.create(Base.prototype);
Classification.prototype.constructor = Classification;

Classification.prototype.classificationCategoryTemplate = function(NA, IT, OR){
	return `<div class="classification__category closed" data-it="${IT}">
			  <p class="font">${NA}</p>
			  <p class="sports-${OR} icon"></p>
			</div>`;
}

Classification.prototype.classificationSubcategoryTemplate = function(NA, IT){
	return `<div class="classification__subcategory closed" data-it="${IT}">
				<img class="icon" src="./img/icon-country/Ukraine.ico">
				<p class="font ellipsis">${NA}</p>
			</div>`;
}

Classification.prototype.forPeriodTemplate = function(data, play, IT){
	return `<div class="classification__link" data-it="${IT}">
				<div class="block">
					<p class="font m-white ellipsis">${this.s_NA(data.NA)[0]}</p>
					<p class="font m-white ellipsis">${this.s_NA(data.NA)[1]}</p>
				</div>
				<div class="block text-right" data-tt="${data.TT}" data-tu="${data.TU}" data-tm="${data.TM}" data-ts="${data.TS}">
					<p class="font m-white">${this.s_SS(data.SS)[0]}-${this.s_SS(data.SS)[1]}</p>
					<p class="font m-white team-time">${this.checkTime(data).timer}</p>
				</div>
			</div>`;
}

Classification.prototype.forSetTemplate = function(data, self, play, IT){
	var html = '';
	html += `<div class="classification__link" data-it="${IT}">
				<div class="block">
					<p class="font m-white ellipsis">${this.s_NA(data.NA)[0]}</p>
					<p class="font m-white ellipsis">${this.s_NA(data.NA)[1]}</p>
				</div>
				<table class="table">
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

Classification.prototype.resultsClassificationTemplate = function(data, play, catIt){
	var self = this, 
		html = '';
	switch (play) {
		case "Soccer":
			html += self.forPeriodTemplate(data, play, data.IT);
		break;
		case "Tennis":
			html += self.forSetTemplate(data, play, data.IT);
		break;
		case "Table Tennis":
			html += self.forSetTemplate(data, play, data.IT);
		break;
		case "Badminton":
			html += self.forSetTemplate(data, play, data.IT);
		break;
		case "Volleyball":
			html += self.forSetTemplate(data, play, data.IT);
		break;
		case "Beach Volleyball":
			html += self.forSetTemplate(data, play, data.IT);
		break;
		default:
			html += self.forPeriodTemplate(data, play, data.IT);
	}
	return html;
}

Classification.prototype.loadData = function(){
	var self = this;
	this.httpGet(this.link)
		.then(response => {
			this.date = JSON.parse(response);
			self.drawData(self)
		})
		.then(error => {});
}

Classification.prototype.drawData = function(self){
	this.html = '';
	$('#live-forMainClassification').html('');
	$.each(this.date.DATA, function (index, item) {
		self.html += `<div class="classification" data-it="${item.IT}">`;
		self.html += self.classificationCategoryTemplate(item.NA, item.IT, item.ID)
		var catIt = item.IT,
			play = item.NA
		$.each(item.CT, function (index, item) {
			var d_NA = item.NA
			if (self.checkValue(item, 'NA')) {
				self.html += self.classificationSubcategoryTemplate(item.NA, item.IT);
			}
			$.each(item.EV, function(index, item){
				if (self.checkValue(item, 'NA')) {
					self.html += self.resultsClassificationTemplate(item, play, catIt)
				}
			});
		});
		self.html += '</div>';
	});
	$('#live-forMainClassification').html(this.html);
	//self.startTimer();
};

classification = new Classification();
classification.loadData();