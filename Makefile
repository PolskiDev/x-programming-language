all: link
	node src/xcc.js -c Main.xl

link:
	npm install --save-dev typescript @types/node
	npx tsc src/*.ts
	npx tsc src/lib/*.ts

clean:
	rm -Rf src/*.js src/lib/*.js
