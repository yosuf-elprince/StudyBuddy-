build:
	docker build -t studybuddy .

run:
	docker run -d -p 8080:80 --name studybuddy-app studybuddy

stop:
	docker stop studybuddy-app
	docker rm studybuddy-app