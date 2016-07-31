
NPM ?= $(NODE) $(shell which npm)
NPM_BIN = $(shell npm bin)


help:
	echo 'Usage:'
	echo '  make expcalc-build      : build expcalc for prod'
	echo '  make expcalc-watch      : watch expcalc for dev'
	echo '  make pinhole-build      : build pinhole for prod'
	echo '  make pinhole-watch      : watch pinhole for dev'
	echo '  make moonlight-build    : build moonlight for prod'
	echo '  make moonlight-watch    : watch moonlight for dev'
	echo '  make publish            : build all and publish site'


expcalc-build:
	echo 'Building Expcalc'
	@$(NPM_BIN)/browserify ./src/expcalc.js -o ./public/expcalc-bundle.js -t babelify

expcalc-watch:
	echo 'Watching Expcalc'
	@$(NPM_BIN)/watchify ./src/expcalc.js -o ./public/expcalc-bundle.js -t babelify -v

pinhole-build:
	echo 'Building Pinhole'
	@$(NPM_BIN)/browserify ./src/pincalc.js -o ./public/pinhole/pinhole-bundle.js -t babelify

pinhole-watch:
	echo 'Watching Pinhole'
	@$(NPM_BIN)/watchify ./src/pincalc.js -o ./public/pinhole/pinhole-bundle.js -t babelify -v

moonlight-build:
	echo 'Building Moonlight'
	@$(NPM_BIN)/browserify ./src/moonlight.js -o ./public/moonlight/moonlight-bundle.js -t babelify

moonlight-watch:
	echo 'Watching Moonlight'
	@$(NPM_BIN)/watchify ./src/moonlight.js -o ./public/moonlight/moonlight-bundle.js -t babelify -v


all: expcalc-build pinhole-build moonlight-build
	@echo "Build Complete"

publish: all
	rsync -avz --delete ./public/ oscar:/opt/sites/light.wtf/



.PHONY: help all publish

