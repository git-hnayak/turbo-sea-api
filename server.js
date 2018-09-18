//Node Modules
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const debug = require('debug')('app:startup');
const morgan = require('morgan');
const pug = require('pug');
const config = require('config');

const secret = config.get('secret_key');
console.log('Secret Key: ', secret);

//Router modules
const homeRouter = require('./router/homeRouter');
const usersRouter = require('./router/usersRouter');

//Miscellaneous
const app = express();
const environment = app.get('env'); //Get Environment variable NODE_ENV
const port = process.env.PORT || 4004;

//DB Connection
mongoose.connect('mongodb://localhost/turbosea', { useNewUrlParser: true })
    .then((res) => debug('Connected to data base...'))
    .catch(err => debug('Error while establishing connection to data base', err));

//Middlewares
app.use(helmet());
app.use(express.json()); //for parsing JSON request body
app.use(express.urlencoded({ extended: true })); //for parsing url encoded request
app.use(express.static('public')); //for serving static files
if (environment === 'development') {
    app.use(morgan('tiny'));
}

//Routes
app.use('/', homeRouter);
app.use('/api/users', usersRouter);

//App settings
app.set('view engine', 'pug'); //setting view engine for the app i.e. pug
app.set('views', 'public'); //setting views file path i.e. public

//Starting server
app.listen(port, () => debug(`Server listening on port ${port}...`));



