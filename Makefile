all:
	npm install;
	heroku plugins:install heroku-builds;

deploy:
	gulp clean-build;
	(cd ./dist; heroku builds:create);

load:
	git submodule foreach --recursive git submodule update --init

heroku: heroku_app heroku_addons heroku_config

heroku_app:
	echo "What is the name of the heroku app?"; \
	read heroku_app; \
	heroku apps:create $$heroku_app; \
	echo "Need to create a repo? Go here: https://bitbucket.org/repo/create"

heroku_addons:
	heroku addons:add mongolab; \
	heroku addons:add logentries; \
	echo "Go here to create a deploy hook: https://halo.slack.com/services/new/heroku"

heroku_config:
	heroku config:add NODE_ENV=production

add-collab:
	echo "Who to add as collaborator?"; \
	read collab; \
	heroku sharing:add $$collab