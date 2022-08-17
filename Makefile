up:
	docker-compose up
down:
	docker-compose down
app:
	docker exec -it p2p-node bash
install:
	npm install
migrate:
	migrate-mongo
log:
	grc -c conf.log tail -f logs/app.log
lint:
	node_modules/eslint/bin/eslint.js src
	node_modules/eslint/bin/eslint.js test
	npx prettier --check src
	npx prettier --check test
tests:
	make lint
	npm run test

coverage:
	node_modules/jest/bin/jest.js --coverage