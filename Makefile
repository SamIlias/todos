install:
	npm install

bundle:
	npm run build

http-server:
	npx http-server ./dist

runApp:
	docker-compose up --build -d

stop-containers:
	docker-compose down

