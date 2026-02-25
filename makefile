FORCE:

all: all_tests build
prod: all_tests github

github: FORCE
	- git commit -a
	git push origin master

all_tests: lint test FORCE

dev_env: FORCE
	npm install

dev: FORCE
	npm run dev

build: FORCE
	npm run build

preview: FORCE
	npm run preview

lint: FORCE
	npm run lint

test: FORCE
	npm run test

clean: FORCE
	rm -rf node_modules dist