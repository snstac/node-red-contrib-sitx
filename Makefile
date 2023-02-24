# Makefile for node-red-contrib-sitx
#
# Source:: https://github.com/ampledata/node-red-contrib-sitx
# Author:: Greg Albrecht <oss@undef.net>
# Copyright:: Copyright 2023 Greg Albrecht
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
