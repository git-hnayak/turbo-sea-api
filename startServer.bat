@ECHO OFF
start cmd /C mongod
set DEBUG=app:*
set PORT=4004
set NODE_ENV=development
set SECRET_KEY=tURBO$SEa$2223344
nodemon server.js