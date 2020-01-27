.PHONY: all
all: style minify

minify: main.css splash.css intro.js resume.js
	csso main.css > main.min.css
	csso splash.css > splash.min.css
	# mv style.css.map style.min.css.map
	# sed -i 's/style\.css/style\.min\.css/g' style.min.css.map
	uglifyjs resume.js > resume.min.js
	uglifyjs intro.js > intro.min.js

style: sass/*
	sass sass/style.scss main.css
	sass sass/splash.scss splash.css