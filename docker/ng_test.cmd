cd %~dp0..
docker-compose run --rm -p 9876:9876 node ng test --poll 100
