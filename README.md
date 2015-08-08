
Prerequisites
=============



On linux you may need to run:

`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

when developing if you get a `Error: watch ENOSPC` error.

Type definitions for typescript: 

`npm install tsd -g`

Use heroku-push plugin for deploys:

`heroku plugins:install https://github.com/ddollar/heroku-push`