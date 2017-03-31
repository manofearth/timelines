cd %~dp0..
docker-compose run --rm -p 4200:4200 node ng serve --host 0.0.0.0 --poll 100
