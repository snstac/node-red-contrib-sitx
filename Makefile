# Makefile for node-red-contrib-sitx
#
# Source:: https://github.com/snstac/node-red-contrib-sitx
# Author:: Greg Albrecht <gba@snstac.com>
# Copyright:: Copyright 2023 Sensors & Signals LLC
# License:: Apache License, Version 2.0
#

.DEFAULT_GOAL := all


all: install

install:
	npm install -g .

publish:
	npm publish

lint: jshint eslint jslint

jshint:
	jshint sitx/*.js

eslint:
	eslint sitx/*.js

jslint:
	jslint sitx/*.js

prettier:
	npx prettier --write .

mkdocs:
	pip install -r docs/requirements.txt
	mkdocs serve

