.PHONY: all prod github install dev build preview clean

all: install

prod: github

github: FORCE
	- git commit -a
	git push origin master

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

clean:
	rm -rf node_modules dist

FORCE: