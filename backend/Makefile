stop:
	-docker stop $$(docker ps -a -q)
	-docker rm $$(docker ps -a -q)

start: stop
	-docker stop $$(docker ps -a -q)
	-docker rm $$(docker ps -a -q)
	docker-compose up -d --build

down: stop
	docker-compose down

install: start
	docker-compose -f docker-compose.yml -f wp-auto-config.yml run --rm wp-auto-config