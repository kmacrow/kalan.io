
BUILD = "base"

build: clean
	@lessc less/main.less > site/${BUILD}.min.css
	@uglifyjs js/main.js \
	-nc > tmp.min.js
	@cat js/jquery.min.js js/jquery.hypher.js js/en-us.js js/d3.v3.min.js tmp.min.js \
	> site/${BUILD}.min.js
	@rm tmp.min.js  
clean:
	rm -f site/*.css site/*.js