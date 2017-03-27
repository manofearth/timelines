cd %~dp0
docker-compose run --rm --workdir=/usr/src/app node node_modules/.bin/ng %*
