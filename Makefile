all:
	docker-compose up
	
build:
	docker-compose up --build

down:
	docker-compose down


clean: down
	docker system prune -f
	docker volume prune -f
	