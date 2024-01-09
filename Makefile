#run the containers
all:
	docker-compose up
	
#build and run the containers	
build:
	docker-compose up --build

#run the containers in the background
background:
	docker-compose up -d

#stop the containers	
down:
	docker-compose down


#remove the stopped containers, dangling images, dangling build cache
clean: down
	docker system prune -f
	
images:
	docker rmi -f $(docker images -a -q)