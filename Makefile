
build:
	@recess --compile --compress less/main.less > site/site.min.css
	@cat js/main.js | uglifyjs -nc > site/site.min.js
	@cat js/jquery.min.js site/site.min.js > site/site.min.js  
clean:
	rm -f site/*.css site/*.js