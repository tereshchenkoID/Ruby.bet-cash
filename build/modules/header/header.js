var Header = function(){
	this.connect = false;
	this.modules = {
		"logo": {	
			"wrap": "#header-forLogo",
			"css": false,
			"lang": false
		},
		"menu": {
			"wrap": "#header-forMenuMain",
			"css": false,
			"lang": false
		},
		"menu-top": {
			"wrap": "#header-forMenuTop",
			"css": false,
			"lang": false
		},
		"search": {
			"wrap": "#header-forMenuSearch",
			"css": false,
			"lang": false
		}
	};
}

Header.prototype = Object.create(Load.prototype);
Header.prototype.constructor = Header;

Header.prototype.init = function() {
	this.loadModules(this.modules, "header");
};


var header = new Header();
header.init();