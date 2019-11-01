.PHONY: all
all: style minify

minify: style.css main.js
	csso style.css > style.min.css
	mv style.css.map style.min.css.map
	sed -i 's/style\.css/style\.min\.css/g' style.min.css.map
	uglifyjs main.js > main.min.js

style: sass/style.scss sass/_utils.scss sass/_general.scss sass/_title.scss sass/_navbar.scss sass/_main.scss sass/_footer.scss
	sass sass/style.scss style.css