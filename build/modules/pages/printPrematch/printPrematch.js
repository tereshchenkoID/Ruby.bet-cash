var PrintPrematch = function(){
	this.link 			= "http://localhost:8080/ex.json";
	this.html 			= '';
	this.date;
	this.sport_w		= $('#wrapper-sport .block__wrapper');
	this.sport_c		= $('#wrapper-country .block__wrapper');
	this.sport_t		= $('#wrapper-tournament .block__wrapper');
	this.checkbox		= [];
}
PrintPrematch.prototype = Object.create(Base.prototype);
PrintPrematch.prototype.constructor = PrintPrematch;


PrintPrematch.prototype.printTemplate = function(){
	return `<div class="row">
				<div class="cell">
					<p class="sports-1"></p>
					<p class="font ml">Баскетбол</p>
				</div>
				<div class="cell">
					<p class="font">США</p>
				</div>
				<div class="cell">
					<p class="font">ВСЕ</p>
				</div>
				<div class="cell padding">
					<label class="flex-container align-middle">
						<input type="checkbox" class="checkbox">
						<span class="font ml">Доп.ставки</span>
					</label>
				</div>
				<div class="cell">
					<button class="button primary square close"></button>
				</div>
			</div>`;
}


PrintPrematch.prototype.labelSportTemplate = function(data){
	return `<label class="label" for="sports-${data.IT}" data-it="${data.IT}"  data-id="${data.ID}" data-na="${data.NA}">
              <input class="checkbox" id="sports-${data.IT}" type="checkbox">
              <span class="sports-${data.ID}"></span>
              <span class="font ellipsis">${data.NA}</span>
            </label>`;
}

PrintPrematch.prototype.labelCountryTemplate = function(data, checked){
	return `<label class="label" for="country-${data.IT}" data-it="${data.IT}" data-id="${checked.id}" data-na="${checked.na}">
              <input class="checkbox" id="country-${data.IT}" type="checkbox">
              <img src="./img/icon-country/Ukraine.ico">
              <span class="font ellipsis">${data.NA}</span>
            </label>`;
}

PrintPrematch.prototype.labelLeagueTemplate = function(data, checked){
	return `<label class="label" for="tournament-${data.IT}" data-it="${data.IT}" data-id="${checked.id}" data-na="${checked.na}">
              <input class="checkbox" id="tournament-${data.IT}" type="checkbox">
              <span class="font ellipsis">${data.NA}</span>
            </label>`;
}

PrintPrematch.prototype.rm = function(name, it){
	$('[data-'+name+'-wrapper='+it+']').remove();
}


PrintPrematch.prototype.loadData = function(link, action, it){
	this.httpGet(link)
		.then(response => {
			this.date = JSON.parse(response);
			if(action == 'sport'){
				this.sport(it);
			}
			else if(action == 'country'){
				this.country(it);
			}
			else if(action == 'tournament'){
				this.tournament(it);
			}
			else{
				this.load();
			}
		})
		.then(error => {});
}



PrintPrematch.prototype.load = function(){
	var self = this;
	this.sport_w.html('');
	$.each(this.date.DATA, function (index, item) {
		self.html += self.labelSportTemplate(item);
	});
	this.sport_w.html(this.html);
};

PrintPrematch.prototype.sport = function(data){
	var self = this;
	this.html = '';
	this.html += `<div data-country-wrapper="${data.it}">`;
	$.each(this.date.RESULT.CT, function (index, item) {
		self.html += self.labelCountryTemplate(item, data);
	});
	this.html += `</div>`;
	this.sport_c.append(this.html);
}

PrintPrematch.prototype.country = function(data){
	var self = this;
	this.html = '';
	$.each(this.date.RESULT.CT, function (index, item) {
		if (item.IT == data.it) {
			self.html += `<div data-tournament-wrapper="${data.it}">`;
			$.each(item.EV, function (index, item) {
				self.html += self.labelLeagueTemplate(item, data);
			});
			self.html += `</div>`;
		}
	});
	this.sport_t.append(this.html);
}

printPrematch = new PrintPrematch();
printPrematch.loadData(printPrematch.link, 'load', null);



$(document).on('click',"#wrapper-sport .label .checkbox", function(){
	var checked = {
		it : $(this).parent().attr("data-it"),
		id : $(this).parent().attr("data-id"),
		na : $(this).parent().attr("data-na")
	}


	if($(this).is(":checked")){
		printPrematch.loadData(`http://bestline.bet/prematch/?sport_id=${checked.id}`, 'sport', checked);
	} else {
	  	printPrematch.rm('sport', checked.it);
	  	printPrematch.rm('country', checked.it);
	  	printPrematch.rm('tournament', checked.it);
	}
});


$(document).on('click',"#wrapper-country .label .checkbox", function(){
	var checked = {
		it : $(this).parent().attr("data-it"),
		id : $(this).parent().attr("data-id"),
		na : $(this).parent().attr("data-na")
	}

	if($(this).is(":checked")){
		printPrematch.loadData(`http://bestline.bet/prematch/?sport_id=${checked.id}`, 'country', checked);
	} else {
	  	printPrematch.rm('tournament', checked.it);
	}
});


$(document).on('click',"#wrapper-tournament .label .checkbox", function(){
	var checked = {
		it : $(this).parent().attr("data-it"),
		id : $(this).parent().attr("data-id"),
		na : $(this).parent().attr("data-na")
	}
	if($(this).is(":checked")){

	} else {
	  	//printPrematch.rm('tournament', it);
	}
});


/*
$(document).on('click',"#wrapper-sport .label .checkbox#sport", function(){
	$('#wrapper-country .block__wrapper').html('');
	if($(this).is(":checked")){
		$('#wrapper-sport .checkbox').each(function(i, elem){
			var it = $(this).parent().attr("data-it")
			$(elem).prop('checked', true);
			printPrematch.loadData('country', it);
			//printPrematch.country(it);
		});
	}
	else{
		$('#wrapper-sport .checkbox').each(function(i, elem){
			var it = $(this).parent().attr("data-it")
			$(elem).prop('checked', false);
			$('#wrapper-tournament .block__wrapper').html('');
		});
	}
});

$(document).on('click',"#wrapper-country .label .checkbox#country", function(){
	$('#wrapper-tournament .block__wrapper').html('');
	if($(this).is(":checked")){
		$('#wrapper-country .checkbox').each(function(i, elem){
			var it = $(this).parent().attr("data-it")
			$(elem).prop('checked', true);
			printPrematch.loadData('tournament', it);
			//printPrematch.tournament(it);
		});
	}
	else{
		$('#wrapper-country .checkbox').each(function(i, elem){
			var it = $(this).parent().attr("data-it")
			$(elem).prop('checked', false);
		});
	}
});

$(document).on('click',"#wrapper-country .label .checkbox#tournament", function(){
	if($(this).is(":checked")){
		$('#wrapper-tournament .checkbox').each(function(i, elem){
			var it = $(this).parent().attr("data-it")
			$(elem).prop('checked', true);			
		});
	}
	else{
		$('#wrapper-tournament .checkbox').each(function(i, elem){
			var it = $(this).parent().attr("data-it")
			$(elem).prop('checked', false);
		});
	}
});*/